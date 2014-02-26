angular.module('LJ').
controller('Rating', ['$scope', '$http', '$route', '$timeout', '$location', 'ratingFactory',
             function( $scope,   $http,   $route,   $timeout,   $location,   ratingFactory ) {

  ratingFactory.get(function(data) {
    $scope.rating = data;

    $timeout(function() {
      window.ratingHeight = $('.b-rating').height();
    }, 0);
  });

  $scope.$on('$viewContentLoaded', function() {

    // hacky way to set correct scroll position
    // after back button for Chrome
    if (window.ratingHeight) {
      $('.b-rating').css({ height: window.ratingHeight });
    }

    $timeout(function() {
      scroll.restore($location);
    }, 0);
  });

}]);
