angular.module('LJ')
.controller('Post', [
           '$scope', '$route', '$routeParams', 'Cache', 'App', '$document', '$timeout',
  function( $scope,   $route,   $routeParams,   Cache,   App ,  $document ,  $timeout ) {

    Cache.getPost({
      user: $routeParams.user,
      post_id: $routeParams.post_id,
      body: true
    }, function(post) {
      $scope.post = post;
    });

    $scope.$on('$viewContentLoaded', function() {
      $document.scrollTop(0);
    });
  }
]);
