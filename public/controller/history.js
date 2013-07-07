LJ.factory('historyFactory', function() {
  var factory = {};

  factory.history = JSON.parse(localStorage.getItem('history')) || [];

  function syncStorage() {
    localStorage.setItem('history', JSON.stringify(factory.history));
  }

  factory.add = function(entry) {
    factory.history.unshift(entry);

    syncStorage();
  }

  factory.toggleFavorite = function(entry) {
    entry.favorite = !entry.favorite;

    syncStorage();
  }

  factory.settings = {
    showFavorites: true
  };

  return factory;
});

LJ.controller('History', function($scope, historyFactory) {
  $scope.history = historyFactory.history;

  $scope.toggleFavorite = historyFactory.toggleFavorite;

  $scope.settings = historyFactory.settings;

  $scope.filtered = function() {
    return historyFactory.history.filter(function(entry) {
      return $scope.settings.showFavorites ? entry.favorite : true;
    });
  }
});
