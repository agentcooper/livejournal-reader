var Profile = Backbone.Model.extend({
  initialize: function() {
    var that = this;

    this.getData();

    this.on('login', function() {
      console.log('Profile login');

      that.getData();
    });
  },

  getData: function() {
    var that = this;

    $.get('/api/login', function(profile) {
      if (!profile.username) {
        return console.error('Bad login', profile);
      }

      that.set('profile', profile);
    });
  }
});

var ProfileView = Backbone.View.extend({
  initialize: function() {
    var that = this;

    this.model.on('change:profile', function() {
      $('.b-main').addClass('loggedIn');

      var userpic = new Image();

      userpic.onload = function() {
        that.render();
      };

      userpic.src = that.model.get('profile').defaultpicurl;
    });
  },

  render: function() {
    this.$el.html(
      App.tmpl('profile-tmpl')(this.model.get('profile'))
    );
  }
});
