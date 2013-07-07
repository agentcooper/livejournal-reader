function Journal($scope, $http, $route, $routeParams, $location, Text) {
  $http.get('/api/journal', {
    params: {
      user: $routeParams.user,
    }
  }).success(function(journal) {
    journal.events.forEach(function(event) {
      event.body = Text.prettify(event.body);
    });

    $scope.journal = journal.events;

    console.log(journal);
  });
}
