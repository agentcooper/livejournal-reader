angular.module('LJ')
.controller('Feed', [
  '$scope', '$http', '$timeout', '$location', 'Text',

  function($scope, $http, $timeout, $location, Text) {
    $scope.feed = [];

    $scope.loadMore = function(done) {
      if ($scope.busy) {
        return;
      }
      $scope.busy = true;

      $http.get('/api/feed', {
        params: {
          skip: $scope.feed.length,
          itemshow: 7
        }
      }).success(function(feed) {

        console.log(feed.entries.length);

        feed.entries.forEach(function(entry) {
          entry.body = Text.prettify(entry.body);
          entry.loadComments = false;
        });

        $scope.feed = $scope.feed.concat(feed.entries);

        $timeout(function() {
          $scope.busy = false;
        }, 100);

        if (typeof done === 'function') {
          done();
        }
      });
    }

    $scope.go = function(username) {
      scroll.save($location);

      $location.path('/read/' + username);
    }

    $scope.loadMore(function() {
      $timeout(function() {
        scroll.restore($location);
      }, 0);
    });
  }

]);
