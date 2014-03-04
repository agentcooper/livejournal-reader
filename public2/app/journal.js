var Journal = Backbone.Model.extend({
  initialize: function() {
    var that = this;

    App.getJournal({
      journal: this.get('name')
    }, function(journal) {
      that.set('journal', journal);

      that.trigger('refresh');
    });
  }
});

var JournalView = cached(function(args) { return args.model.get('name'); },
Backbone.View.extend({
  initialize: function() {
    var that = this;

    this.model.on('refresh', this.render.bind(this));
  },

  render: function() {
    var journal = this.model.get('journal');

    if (!journal) {
      return;
    }

    this.$el.html(
      tmpl('journal-tmpl')({ journal: journal })
    );

    this.postRender();
  }
})
);

_.extend(JournalView.prototype, postRender);
