function Rating($scope, $http, $route, $timeout, $location, ratingFactory) {
  $scope.loading = true;

  ratingFactory.get(function(data) {
    $scope.rating = data;
  });

  $scope.$on('$viewContentLoaded', function() {
    $timeout(function() {
      scroll.restore($location);
    }, 0);
  });
}
