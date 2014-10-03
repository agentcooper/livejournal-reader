App.Profile = Backbone.Model.extend({
  initialize: function() {
    var that = this;

    if (App.getCookie('auth')) {
      this.getData();
    } else {
      this.set('profile', null); 
    }

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
  },

  isLoggedIn: function() {
    return Boolean(this.get('profile') && this.get('profile').username);
  }
});

App.ProfileView = Backbone.View.extend({
  events: {
    'click .b-menu-login': 'login',
  },

  login: function(event) {
    event.preventDefault();

    App.login();
  },

  initialize: function() {
    var that = this;

    this.model.on('change:profile', function(model, profile) {
      $('.b-main').addClass('loggedIn');

      var userpic = new Image();

      userpic.onload = function() {
        that.render();
      };

      userpic.src = that.model.get('profile').defaultpicurl;
    });

    if (this.model.get('profile') === null) {
      this.render();
    }
  },

  render: function() {
    console.log('Profile render');

    this.$el.html(
      App.tmpl('profile-tmpl')({ profile: this.model.get('profile') })
    );

    if (!this.model.isLoggedIn()) {
      return;
    }

    var done = this.model.get('doneCallback');
    if (typeof done === 'function') {
      done();
      this.model.set('doneCallback', null);
    }
  }
});

App.profile = new App.Profile();
