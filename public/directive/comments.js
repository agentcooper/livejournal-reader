angular.module('LJ')
.directive('ljComments', ['$http', 'App',
                 function( $http ,  App ) {
  return {
    templateUrl: '/partials/comments.html',

    scope: {
      postId: '=',
      user: '='
    },

    link: function(scope, element, attrs) {
      scope.loading = false;

      scope.page = 1;
      scope.page_size = 15;
      scope.comments = [];

      scope.hasMore = function() {
        return scope.page < scope.pages;
      };

      scope.load = function(callback) {
        $http.get('/api/comments/', {
          params: {
            user: scope.user,
            post_id: scope.postId,
            page_size: scope.page_size,
            page: scope.page
          }
        }).success(function(result) {
          console.log(result);
          scope.comments = scope.comments.concat(result.comments);
          scope.pages = result.pages;
          scope.loading = false;

          if (typeof callback === 'function') {
            callback(result);
          }
        });
      }

      scope.loadMore = function() {
        scope.page += 1;

        App.progress.start();
        scope.load(function() {
          App.progress.complete();
        });
      };

      scope.isAuthor = function(comment) {
        return comment.postername === scope.user;
      };

      scope.$watch('postId', function() {

        if (!scope.user || !scope.postId) {
          return;
        }

        scope.loading = true;

        console.log('LOADING');

        scope.load();
      });
    }
  };

}]);
