module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      public2: {
        src: [
          'public2/bower_components/jquery/dist/jquery.js',
          'public2/bower_components/underscore/underscore.js',
          'public2/bower_components/backbone/backbone.js',
          'public2/bower_components/nprogress/nprogress.js',
          'public2/bower_components/momentjs/moment.js',
          'public2/bower_components/drop/drop.js',
          
          'public2/build/templates.js',
          'public2/app/main.js',
          'public2/app/profile.js',
          'public2/app/**/*.js'
        ],
        dest: 'public2/build/script.js'
      }
    },

    preprocess: {
      options: {
        context: {
          DEBUG: grunt.option('production') ? undefined : true
        }
      },

      html : {
        src : 'public2/index.grunt.html',
        dest : 'public2/index.html'
      },
    },

    htmlmin: {
      options: {
        collapseWhitespace: true
      },

      build2: {
        files: {
          'public2/index.html': 'public2/index.grunt.html'
        }
      }
    },

    csso: {
      dist: {
        files: {
          'public2/build/style.css': [
            'public2/stylesheets/*.css'
          ]
        }
      }
    },

    jst: {
      compile: {
        options: {
          templateSettings: {
            interpolate : /\{\{(.+?)\}\}/g
          },

          processName: function(filepath) {
            return filepath.split('/').pop().replace('.', '-');
          }
        },
        files: {
          'public2/build/templates.js': ['public2/templates/**/*.tmpl']
        }
      }
    },

    watch: {
      scripts: {
        files: ['public2/app/**/*.js', 'public2/templates/**/*.tmpl', 'public2/stylesheets/**/*.css'],
        tasks: ['build2'],
        options: {
          spawn: false,
        },
      },
    },

    imageEmbed: {
      dist: {
        src: ['public2/build/style.css'],
        dest: 'public2/build/style.css',
        options: {
          deleteAfterEncoding: false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-csso');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks("grunt-image-embed");

  grunt.registerTask('default', ['jst', 'uglify:public2', 'csso', 'htmlmin:build2', 'imageEmbed']);
};
