this["JST"] = this["JST"] || {};

this["JST"]["about-tmpl"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<div class="b-feed b-entry b-entry__body">\n\n<h2>Features и отличия от livejournal.com</h2>\n\n<ul>\n\n  <li><p>Для топа дополнительно собирается статистика по социальным сетям.</p></li>\n\n  <li><p>Дополнительное форматирование постов, авторазбиение на параграфы.</p></li>  \n\n  <li><p>При переходе из топа в запись и обратно, сохраняется позиция скролла.</p></li>\n\n  <li><p>Все комментарии сразу развернуты, догрузка вниз вместо постраничной навигации.</p></li>\n\n  <li><p>Пока нет OAuth авторизации, раздел <strong>Feed</strong> является френдлентой пользователя <em>agentcooper</em>.</p></li>\n\n  <li><p>В <strong>History</strong> сохраняется вся история постов в рамках текущего браузера.</p></li>\n\n</ul>\n\n<h2>Roadmap</h2>\n\n<ul>\n<li><p>Поиск по тегам.</p></li>\n\n<li><p>OAuth авторизация, чтобы пользователи смогли читать свою ленту.</p></li>\n</ul>\n\n<h2>Contacts</h2>\n\n<p><a href="mailto:artem.tyurin@gmail.com" target="_blank">artem.tyurin@gmail.com</a></p>\n\n<p><a href="https://github.com/agentcooper" target="_blank">https://github.com/agentcooper</a></p>\n\n</div>\n';

}
return __p
};

this["JST"]["comment-tmpl"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<li class="' +
((__t = ( 'b-comment-level-' + (comment.level > 15 ? 'over-15' : comment.level) )) == null ? '' : __t) +
'">\n      \n  <div class="b-thread__comment" bo-class="{ \'b-thread__comment_author\': isAuthor(comment) }">\n    <div class="b-thread__userpic" style="' +
((__t = ( 'background-image: url(' + comment.userpic + ')' )) == null ? '' : __t) +
'"></div>\n\n    <a class="b-thread__username" href="' +
((__t = ( '/read/' + comment.postername )) == null ? '' : __t) +
'">' +
((__t = ( comment.identity_display || comment.postername )) == null ? '' : __t) +
'</a>\n    <p class="b-thread__body">' +
((__t = ( comment.body )) == null ? '' : __t) +
'</p>\n  </div>\n\n</li>\n';

}
return __p
};

this["JST"]["comments-tmpl"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="b-comments" data-bind-class="{\n  \'b-comments-loading\': \'loading\',\n  \'b-comments-more\': \'hasMore\'\n}">\n\n  <ul class="b-thread"></ul>\n\n  <span class="b-comments__more">Load more</span>\n\n  <div class="b-comments--loading">\n    Loading comments\n    <div class="spinner">\n      <div class="rect1"></div>&nbsp;<div class="rect2"></div>&nbsp;<div class="rect3"></div>&nbsp;<div class="rect4"></div>&nbsp;<div class="rect5"></div>\n    </div>\n  </div>\n\n</div>\n';

}
return __p
};

this["JST"]["feed-tmpl"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<ol class="b-feed" infinite-scroll="loadMore()" infinite-scroll-distance="1" infinite-scroll-immediate-check="false" infinite-scroll-disabled="busy">\n\n  <h1 class="b-header">Френдлента</h1>\n\n  ';
 _.each(feed.entries, function(entry){ ;
__p += '\n  <li class="b-entry">\n    <h2 class="b-entry__header">' +
((__t = ( entry.subject_raw )) == null ? '' : __t) +
'</h2>\n\n    <div class="b-post_aside" ng-click="go(entry.username);">\n      <img class="b-post__userpic" src="' +
((__t = ( entry.poster_userpic_url )) == null ? '' : __t) +
'">\n      <p class="b-post__username">' +
((__t = ( entry.username )) == null ? '' : __t) +
'</p>\n      <p class="b-post__time">' +
((__t = ( entry.logtime )) == null ? '' : __t) +
'</p>\n    </div>\n\n    <div class="b-entry__body">' +
((__t = ( entry.body )) == null ? '' : __t) +
'</div>\n    <a href class="b-boop__comments">' +
((__t = ( entry.reply_count )) == null ? '' : __t) +
'</a>\n  </li>\n  ';
 }); ;
__p += '\n\n</ol>\n';

}
return __p
};

this["JST"]["history-tmpl"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<ol class="b-history" data-bind-class=" { \'empty\': \'empty\' } ">\n\n  <h1 class="b-header">Reading history and favorites</h1>\n\n  <p ng-show="!history.length">\n    You didn\'t read any entries yet. Check out <a href="/">main top</a>.\n  </p>\n\n  <p ng-show="history.length">\n    Please note, that right now history and favorites are local to your browser.\n  </p>\n\n  <div ng-show="history.length" class="b-history__settings">\n    <label>\n      <input type="checkbox" ng-model="settings.showFavorites">\n      Show only favorites\n    </label>\n  </div>\n\n  ';
 _.each(entries, function(entry) { ;
__p += '\n  <li class="b-history__entry">\n    <a class="b-history__link" href="/read/' +
((__t = (entry.user)) == null ? '' : __t) +
'/' +
((__t = (entry.ditemid)) == null ? '' : __t) +
'">\n      <span class="b-history__entry__name">' +
((__t = (entry.subject)) == null ? '' : __t) +
'</span> &mdash; ' +
((__t = (entry.user)) == null ? '' : __t) +
'</a>\n\n    <span class="b-history__favorite" ng-class="{ \'b-history__favorite-active\': entry.favorite }" ng-click="toggleFavorite(entry);"></span>\n  </li>\n  ';
 }); ;
__p += '\n\n</ol>\n';

}
return __p
};

this["JST"]["journal-tmpl"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<ol class="b-feed">\n  ';
 _.each(journal.events, function(entry) { ;
__p += '\n  <li class="b-entry">\n    <span class="b-boop__header"><a href="' +
((__t = ( entry.url )) == null ? '' : __t) +
'">' +
((__t = ( entry.subject || '(no subject)' )) == null ? '' : __t) +
'</a></span>\n\n    <div class="b-post_aside">\n      <img class="b-post__userpic" bo-src="entry.poster_userpic_url">\n      <span class="b-post__username" bo-html="entry.username"></span>\n    </div>\n\n    <div class="b-entry__body">' +
((__t = ( entry.body )) == null ? '' : __t) +
'</div>\n\n    <p class="b-entry__tags">' +
((__t = ( entry.props.tags )) == null ? '' : __t) +
'</p>\n\n    <span class="b-boop__comments">' +
((__t = ( entry.reply_count )) == null ? '' : __t) +
'</span>\n  </li>\n  ';
 }); ;
__p += '\n</ol>\n';

}
return __p
};

this["JST"]["post-tmpl"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<article class="b-post">\n  <header class="b-post__header">\n    <h1 class="b-post__title">' +
((__t = ( post.subject )) == null ? '' : __t) +
'</h1>\n    <a href="' +
((__t = ( '/read/' + post.journal )) == null ? '' : __t) +
'" class="b-lj_user">' +
((__t = ( post.journal )) == null ? '' : __t) +
'</a>\n  </header>\n  <div class="b-post__body">\n    ' +
((__t = ( post.body )) == null ? '' : __t) +
'\n  </div>\n\n  <div class="b-post-comments"></div>\n</article>\n';

}
return __p
};

this["JST"]["rating-tmpl"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="b-rating">\n  <h1 class="b-header">Топ ЖЖ</h1>\n\n  <div class="b-top__controls">\n    Сортировать по\n    <a href="javascript:void(0);" class="b-pseudo" data-sort="position">позиции</a>,\n    <a href="javascript:void(0);" class="b-pseudo" data-sort="-tw_count">твитам</a>,\n    <a href="javascript:void(0);" class="b-pseudo" data-sort="-fb_count">фейсбуку</a>,\n    <a href="javascript:void(0);" class="b-pseudo" data-sort="-vk_count">вконтакте</a>,\n    <a href="javascript:void(0);" class="b-pseudo" data-sort="-reply_count">комментариям</a>.</span>\n  </div>\n\n\n  <ol class="b-social">\n  ';
 _.each(rating.top, function(post){ ;
__p += '\n\n  <li class="b-social-item">\n\n      <a class="b-social-link" href="' +
((__t = ( '/read/' + post.journal + '/' + post.postId )) == null ? '' : __t) +
'">\n\n        <span class="b-social-header">' +
((__t = ( post.title )) == null ? '' : __t) +
'</span>\n        <span class="b-social-details"><span class="user">' +
((__t = ( post.journal )) == null ? '' : __t) +
'</span></span>\n\n        <div class="b-social-body">' +
((__t = ( post.body )) == null ? '' : __t) +
'</div>\n\n        <div class="b-social-stats">\n          <span class="b-entry__twitter"><span class="b-entry__tweets">' +
((__t = (post.tw_count)) == null ? '' : __t) +
'</span></span></span><span class="b-entry__fb"><span>' +
((__t = ( post.fb_count )) == null ? '' : __t) +
'</span> shares</span><span class="b-entry__livejournal"><span>' +
((__t = (post.reply_count)) == null ? '' : __t) +
'</span> comments</span><span class="b-entry__vk"><span>' +
((__t = ( post.vk_count )) == null ? '' : __t) +
'</span> shares</span>\n        </div>\n      </a>\n\n  </li>\n  ';
 }); ;
__p += '\n  </ol>\n\n  </div>\n';

}
return __p
};