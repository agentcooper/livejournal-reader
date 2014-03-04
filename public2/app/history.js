var History = Backbone.Model.extend({

});

var HistoryView = Backbone.View.extend({
  render: function() {
    this.$el.html(
      tmpl('history-tmpl')({ entries: [] })
    );
  }
});
