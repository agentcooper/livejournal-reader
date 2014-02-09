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

  Social.get(function(top) {
    $scope.top = top;

    $timeout(function() {
      window.socialHeight = $('.b-social').height();
    }, 0);
  });

  $scope.toggle = function(event, post) {
    post.show = !post.show;

    return false;
  };

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
