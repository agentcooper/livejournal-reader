angular.module('LJ')
.factory('Social', ['$http', function($http) {

  var factory = {};

  factory.get = function(callback) {
    if (factory.top) {
      return callback(factory.top);
    }

    $http.get('/top.json').success(function(res) {
      factory.top = res.top;
      callback(factory.top);
    });
  };

  return factory;

}])
.controller('SocialCtrl', ['$scope', 'Social', '$timeout', '$location', 
                  function( $scope,   Social ,  $timeout ,  $location ) {

  $scope.predicate = 'at';
  $scope.reverse = true;

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
