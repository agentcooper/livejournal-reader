App.Rating = Backbone.Model.extend({

  defaults: {
    rating: { top: [] }
  },

  api: {
    en: 'en_US',
    ru: 'ru_RU'
  },

  getData: function() {
    var that = this;

    console.log('fetch rating');

    App.progress.start();

    $.get('top_' + this.api[App.lang] + '.json', function(result) {
      result.top.splice(100);

      that.set('rating', result);

      App.progress.complete();
    });
  },

  sort: function(type, reverse) {
    console.log('sort', arguments);

    if (reverse) {
      type = type.slice(1);
    }

    function compare(a, b) {
      if (b[type] > a[type]) { return -1; }
      if (b[type] < a[type]) { return  1; }
      return 0;
    }

    this.get('rating').top.sort(
      reverse ? function(a, b) {
        return compare(b, a)
      } : compare
    );

    this.trigger('refresh');
  },

  initialize: function() {
    console.log('Rating init');
    this.getData();
  }
});

App.Rating = singleton(App.Rating);

App.RatingView = Backbone.View.extend({
  events: {
    'click [data-sort]': 'sort'
  },

  sort: function(event) {
    event.preventDefault();

    var type = $(event.currentTarget).data('sort');

    this.model.sort(type, type.charAt(0) === '-');
  },

  initialize: function() {
    console.log('RatingView init');

    var that = this;

    this.model.on('change:rating refresh', this.render.bind(this));
  },

  render: function() {
    console.log('render RatingView');

    this.$el.html(
      App.tmpl('rating-tmpl')({ rating: this.model.get('rating') })
    );

    this.postRender();
  }
});

App.RatingView = singleton(App.RatingView);

_.extend(App.RatingView.prototype, postRender);
