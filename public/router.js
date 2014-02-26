angular.module('LJ')
.config(['$routeProvider', '$locationProvider',
function( $routeProvider,   $locationProvider) {

  $locationProvider.html5Mode(true);

  $routeProvider.
    when('/read/:user/:post_id', {
      templateUrl: '/partials/post.html',
      controller: 'Post'
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
    when('/', {
      templateUrl: '/partials/social.html',
      controller: 'SocialCtrl'
    })
    .when('/about', {
      templateUrl: '/partials/about.html'
    });

}]);
