angular.module('LJ')
.factory('App', ['ngProgress', function(ngProgress) {
  var factory = {};

  ngProgress.color('#3F5F9E');

  factory.progress = {
    start: function() {
      ngProgress.reset();
      ngProgress.start();
    },

    complete: function() {
      ngProgress.complete();
    }
  };

  return factory;
}])
.factory('Social', ['$http', 'App',
           function( $http ,  App ) {

  var factory = {};

  factory.get = function(callback) {
    if (factory.top) {
      return callback(factory.top);
    }

    App.progress.start();
    $http.get('/top.json').success(function(res) {
      App.progress.complete();

      res.top = res.top.slice(0, 200);

      factory.top = res;
      console.log(factory.top);
      callback(factory.top);
    });
  };

  return factory;

}])
.controller('SocialCtrl', ['$scope', 'Social', '$timeout', '$location', 
                  function( $scope,   Social ,  $timeout ,  $location ) {

  $scope.predicate = 'position';
  $scope.reverse = false;

  $scope.top = [];

  /*
   * obj.to
   * obj.from
   * obj.chunk
   * obj.delay
   */
  function progressiveCopy(obj, callback) {
    var sourceCopy = obj.from.slice();

    (function nextChunk() {
      if (sourceCopy.length > 0) {
        Array.prototype.push.apply(obj.to, sourceCopy.splice(0, obj.chunk));
        $timeout(nextChunk, obj.delay);
      } else {
        callback();
      }
    })();
  }

  Social.get(function(top) {
    $scope.top = top;

    $timeout(function() {
      window.socialHeight = $('.b-social').height();
    }, 0);
  });

  $scope.toggleTweets = function(event, post) {
    event.preventDefault();
    event.stopPropagation();

    post.show = !post.show;
  };

  $scope.isSelected = function(predicate) {
    return ($scope.predicate === predicate) ? 'b-selected' : '';
  };

  $scope.use = function(predicate) {
    if ($scope.predicate === predicate) {
      $scope.reverse = !$scope.reverse;
    } else {
      $scope.predicate = predicate;
      $scope.reverse = true;
    }
  }

  $scope.$on('$locationChangeStart', function(event, next, current) {
    scroll.save(current);
  });

  $scope.$on('$viewContentLoaded', function() {

    // hacky way to set correct scroll position
    // after back button for Chrome
    if (window.socialHeight) {
      $('.b-social').css({ height: window.socialHeight });
    }

    $timeout(function() {
      scroll.restore($location);
    }, 0);
  });

}]);
