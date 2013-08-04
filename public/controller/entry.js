angular.module('LJ')
.controller('Entry', [
  '$scope', '$route', '$routeParams', '$http', 'historyFactory', 'Text',
  function($scope, $route, $routeParams, $http, historyFactory, Text) {
    $http.get('/api/post', {
      params: {
        user: $routeParams.user,
        post_id: $routeParams.post_id,
        body: true
      }
    }).success(function(data) {
      console.log(data);

      $scope.post_id = Number($routeParams.post_id);
      $scope.body = Text.prettify(data.event);
      $scope.title = data.subject;
      $scope.user = $routeParams.user;


      data.user = $routeParams.user;
      data.visited = Date.now();
      historyFactory.add(data);
    });


    $scope.$on('$viewContentLoaded', function() {
      $(document).scrollTop(0);
    });
  }
]);
