App.Journal = Backbone.Model.extend({
  initialize: function() {
    var that = this;

    LJ.getJournal({
      journal: this.get('name')
    }, function(journal) {
      that.set('journal', journal);

      that.trigger('refresh');
    });
  }
});

App.JournalView = Backbone.View.extend({
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
      App.tmpl('journal-tmpl')({ journal: journal })
    );

    this.postRender();
  }
});

App.JournalView = cached(App.JournalView, function(args) {
  return args.model.get('name');
});

_.extend(App.JournalView.prototype, postRender);
