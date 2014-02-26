angular.module('LJ')
.directive('ljComments', ['$http', 'App', 'Text',
                 function( $http ,  App ,  Text ) {

  function process(comments) {
    var level = {};

    comments.forEach(function(comment) {
      if (!comment.parentdtalkid) {
        comment.level = 0;
      } else {
        if (level[comment.parentdtalkid]) {
          comment.level = level[comment.parentdtalkid] + 1;
        } else {
          comment.level = 1;
        }
        
        level[comment.dtalkid] = comment.level;
      }

      comment.body = Text.prettify(comment.body);
    });

    console.log('processed', comments);
  }

  return {
    templateUrl: '/partials/comments.html',

    scope: {
      postId: '=',
      user: '='
    },

    link: function(scope, element, attrs) {
      scope.loading = false;

      scope.page = 1;
      scope.page_size = 10;
      scope.comments = [];

      scope.hasMore = function() {
        return scope.page < scope.pages;
      };

      scope.load = function(callback) {
        scope.loading = true;
        $http.get('/api/comments/', {
          params: {
            user: scope.user,
            post_id: scope.postId,
            page_size: scope.page_size,
            page: scope.page
          }
        }).success(function(result) {
          console.log(result);

          process(result.comments);


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

        scope.loading = true;
        scope.load(function() {
          scope.loading = false;
        });
      };

      scope.isAuthor = function(comment) {
        return comment.postername === scope.user;
      };

      var unwatch = scope.$watch('postId', function() {

        if (!scope.user || !scope.postId) {
          return;
        }

        scope.loading = true;

        scope.load();

        unwatch();
      });
    }
  };

}]);
