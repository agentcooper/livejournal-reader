App.History = Backbone.Model.extend({

});

App.HistoryView = Backbone.View.extend({
  render: function() {
    this.$el.html(
      App.tmpl('history-tmpl')({ entries: [] })
    );
  }
});
