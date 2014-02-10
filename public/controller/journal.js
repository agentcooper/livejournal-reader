angular.module('LJ').
controller('Journal', ['$scope', '$http', '$route', '$routeParams', '$location', 'Text', 'App',
              function( $scope,   $http,   $route,   $routeParams,   $location,   Text ,  App ) {

  App.progress.start();
  $http.get('/api/journal', {
    params: {
      user: $routeParams.user,
    }
  }).success(function(journal) {
    App.progress.complete();

    journal.events.forEach(function(event) {
      event.body = Text.prettify(event.body);
    });

    $scope.journal = journal.events;

    console.log(journal);
  });

}]);
