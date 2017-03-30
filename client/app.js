var app = angular.module("app", ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'index.html',
      controller: 'appCtrl'
    })
    .when('/login', {
      templateUrl: 'login.html',
      controller: 'appCtrl'
    })
    .when('/signup', {
      templateUrl: 'signup.html',
      controller: 'appCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});

app.controller("appCtrl", function($scope, $http, $location) {
    $scope.posts = [];
    $scope.lineLimitWarning = false;
    $scope.lines = {
      "Nordic Naturals": {
        current: null,
        limit: 34
      },
      "Bluebonnet": {
        current: null,
        limit: 6
      },
      "Aloe Life": {
        current: null,
        limit: 4
      },
      "Host Defense": {
        current: null,
        limit: 4
      },
    };
    $http.get('/demos')
      .then(function(success) {
        // console.log(success);
          success.data.forEach(el => {
            const oldHeight = $('.row.content').height();
            //get demo data
            $scope.posts.push(el);
            //get totals for company line count
            $scope.lines[el.line].current ? $scope.lines[el.line].current += 1 : $scope.lines[el.line].current = 1;
            const newHeight = oldHeight + 245;
            $('.row.content').height(newHeight);
          });
        },
        function(err) {
          console.log(err);
        });

    $scope.inputDate = new Date($scope.inputDate);
    $scope.newPost = function() {
      let post = {};
      post.line = $scope.inputLine;
      post.store = $scope.inputStore;
      post.date = $scope.inputDate;
      post.time = [$scope.inputTime, $scope.inputAMPM];
      post.month = $scope.inputDate.getMonth();
      post.comments = $scope.inputComments;
      $scope.posts.unshift(post);
      $scope.lines[post.line].current = $scope.lines[post.line].current + 1 || 1;
      const oldHeight = $('.row.content').height();
      const newHeight = oldHeight + 245;
      $('.row.content').height(newHeight);

      return $http.post('/newDemo', post)
        .then(function(success) {}, function(err) { if(err) {}});
    };
    $scope.changedLine = function(inputLine) {
      if($scope.lines[inputLine].current >= $scope.lines[inputLine].limit) {
        $scope.lineLimitWarning = true;
      } else {
        $scope.lineLimitWarning = false;
      }
    };
    $scope.login = function() {
      let user = {};
      user.username = $scope.username;
      user.password = $scope.password;
      console.log(user);
    }
    $scope.signup = function() {
      let newUser = {};
      if($scope.newPassword !== $scope.confirmPassword) {
        $scope.passwordMismatch = true;
      } else {
        newUser.username = $scope.newUsername;
        newUser.password = $scope.newPassword;
        console.log(newUser);
        $http.post('/newUser', newUser)
          .then(function(success) {  console.log(success, 'success'); $location.path( "/" ); }, function(err) { console.log(err, 'error') });
      }
    }
});
