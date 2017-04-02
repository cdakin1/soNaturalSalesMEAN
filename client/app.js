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
    $scope.isLoggedIn = false;
    $scope.currentUser;
    $http.get('/currentUser')
      .then(function(success) {
        console.log(success);
        if(success.data) {
          $scope.isLoggedIn = true;
          $scope.currentUser = success.data.username;
        } else {
          if($location.path() !== "/signup") {
            $location.path( "/login" );
          };
        }
      }), function(err) { console.log(error) };

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
          if(success.data.length > 0) {
            success.data.forEach(el => {
              const oldHeight = $('.row.content').height();
              //get demo data
              if(el.user === $scope.currentUser) {
                $scope.posts.push(el);
              }
              //get totals for company line count
              $scope.lines[el.line].current ? $scope.lines[el.line].current += 1 : $scope.lines[el.line].current = 1;
              const newHeight = oldHeight + 245;
              $('.row.content').height(newHeight);
            });
          }
        },
        function(err) {
          console.log(err);
        });

    $scope.inputDate = new Date($scope.inputDate);
    $scope.newPost = function() {
      let post = {};
      post.user = $scope.currentUser;
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
      $scope.loginError = null;
      let user = {};
      user.username = $scope.username;
      user.password = $scope.password;
      $http.post('/login', user)
        .then(function(success) {
          $location.path( "/" );
        },
        function(err) {
          $scope.loginError = err.data.message;
        });
      };

    $scope.logout = function() {
      console.log('test')
      $http.get('/logout')
        .then(function(success) {
          $scope.isLoggedIn = false;
          $scope.currentUser = null;
        })
    }
    $scope.signup = function() {
      let newUser = {};
      $scope.passwordMismatch = false;
      $scope.duplicateUsername = false;
      if($scope.newPassword !== $scope.confirmPassword) {
        $scope.passwordMismatch = true;
      } else {
        newUser.username = $scope.newUsername;
        newUser.password = $scope.newPassword;
        console.log(newUser);
        $http.post('/newUser', newUser)
          .then(function(success) {
            console.log(success);
              $location.path("/login");
          }, function(err) {
            $scope.signupError = err.data.message;
            console.log(err)
            $scope.duplicateUsername = true;
          });
      }
    }
});
