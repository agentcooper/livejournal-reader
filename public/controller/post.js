angular.module('LJ').
controller('Post', ['$scope', '$http', '$route', '$location',
           function( $scope,   $http,   $route,   $location  ) {

  $scope.load = function() {
    scroll.save($location);

    $location.path(
      '/read/' + $scope.post.ljuser[0].journal + '/' + $scope.post.post_id
    );
  };

}]);
