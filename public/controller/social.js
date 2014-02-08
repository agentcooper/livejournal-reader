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
.controller('SocialCtrl', ['$scope', 'Social', 
                  function( $scope,   Social ) {

  Social.get(function(top) {
    $scope.top = top;
  });

}]);
