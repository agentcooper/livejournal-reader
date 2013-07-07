LJ.directive('blink', function($http) {
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

      scope.load = function() {
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
        });
      }

      scope.loadMore = function() {
        scope.page += 1;
        scope.load();
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
});
