angular.module('LJ')
.config(['$routeProvider', '$locationProvider',
function( $routeProvider,   $locationProvider) {

  $locationProvider.html5Mode(true);

  $routeProvider.
    when('/', {
      templateUrl: '/partials/rating.html',
      controller: 'Rating',
      reloadOnSearch: false
    }).
    when('/read/:user/:post_id', {
      templateUrl: '/partials/post.html',
      controller: 'Entry'
    }).
    when('/read/:user', {
      templateUrl: '/partials/journal.html',
      controller: 'Journal'
    }).
    when('/feed', {
      templateUrl: '/partials/feed.html',
      controller: 'Feed'
    }).
    when('/comments', {
      templateUrl: '/partials/test.html',
      controller: 'Comments'
    }).
    when('/history', {
      templateUrl: '/partials/history.html',
      controller: 'History'
    }).
    when('/socialtop', {
      templateUrl: '/partials/social.html',
      controller: 'SocialCtrl'
    });

}]);
