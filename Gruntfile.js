module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      public: {
        src: [
          'public/bower_components/jquery/dist/jquery.js',
          'public/bower_components/underscore/underscore.js',
          'public/bower_components/backbone/backbone.js',
          'public/bower_components/nprogress/nprogress.js',
          'public/bower_components/momentjs/moment.js',
          'public/bower_components/drop/drop.js',
          
          'public/build/templates.js',
          'public/app/main.js',
          'public/app/profile.js',
          'public/app/**/*.js'
        ],
        dest: 'public/build/script.js'
      }
    },

    preprocess: {
      options: {
        context: {
          DEBUG: grunt.option('production') ? undefined : true
        }
      },

      html : {
        src : 'public/index.grunt.html',
        dest : 'public/index.html'
      },
    },

    htmlmin: {
      options: {
        collapseWhitespace: true
      },

      build: {
        files: {
          'public/index.html': 'public/index.grunt.html'
        }
      }
    },

    csso: {
      dist: {
        files: {
          'public/build/style.css': [
            'public/stylesheets/*.css'
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
          'public/build/templates.js': ['public/templates/**/*.tmpl']
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/app/**/*.js',
          'public/templates/**/*.tmpl',
          'public/stylesheets/**/*.css'
        ],
        tasks: ['default'],
        options: {
          spawn: false,
        },
      },
    },

    imageEmbed: {
      dist: {
        src: ['public/build/style.css'],
        dest: 'public/build/style.css',
        options: {
          deleteAfterEncoding: false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-csso');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks("grunt-image-embed");

  grunt.registerTask('default', [
    'jst',
    'uglify:public',
    'csso',
    'htmlmin:build',
    'imageEmbed'
  ]);
};
