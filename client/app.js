var app = angular.module("app", []);

app.controller("appCtrl", function($scope, $http) {
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
});
