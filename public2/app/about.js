App.AboutView = Backbone.View.extend({
  initialize: function() {
    console.log('about init');
  },

  render: function() {
    console.log('about render');

    this.$el.html(
      App.tmpl('about-tmpl')()
    );

    $(document).scrollTop(0);
  }
});
