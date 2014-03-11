module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      my_target: {
        src: [
          'public/stuff.js',

          'public/controller/**/*.js',
          'public/directive/**/*.js',
          'public/service/**/*.js',

          'public/router.js',

          'public/bower_components/ngInfiniteScroll/ng-infinite-scroll.js'
        ],
        dest: 'public/build/script.js'
      },

      public2: {
        src: [
          'public2/bower_components/jquery/dist/jquery.js',
          'public2/bower_components/underscore/underscore.js',
          'public2/bower_components/backbone/backbone.js',
          'public2/bower_components/nprogress/nprogress.js',
          'public2/bower_components/momentjs/moment.js',
          
          'public2/build/templates.js',
          'public2/app/main.js',
          'public2/app/**/*.js'
        ],
        dest: 'public2/build/script.js'
      }
    },

    concat: {
      dist: {
        options: {
          separator: ';'
        },
        src: [
          'public/bower_components/jquery/jquery.min.js',

          'public/bower_components/angular/angular.min.js',
          'public/bower_components/angular-route/angular-route.min.js',

          'public/bower_components/angular-bindonce/bindonce.min.js',

          'public/bower_components/momentjs/min/moment.min.js',

          'public/bower_components/ngprogress/build/ngProgress.min.js',

          'public/build/script.js'
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
        src : 'public2/index.grunt.html',
        dest : 'public2/index.html'
      },
    },

    htmlmin: {
      options: {
        collapseWhitespace: true
      },

      dist: {
        expand: true,
        flatten: true,
        src: ['public/partials/**/*.html'],
        dest: 'public/build/partials/'
      },

      finalc: {
        files: {
          'public/index.html': 'public/index.html'
        }
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
          'public/build/style.css': [
            'public/stylesheets/*.css'
          ],

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
    }

    // concat2: {
    //   dist: {
    //     options: {
    //       separator: ';'
    //     },
    //     src: [
    //       'public2/bower_components/underscore/underscore.js',

    //       'public2/bower_components/backbone/backbone.js',

    //       'public2/bower_components/angular-bindonce/bindonce.min.js',

    //       'public2/bower_components/momentjs/min/moment.min.js',

    //       'public2/bower_components/ngprogress/build/ngProgress.min.js',

    //       'public2/build/script.js'
    //     ],
    //     dest: 'public/build/script.js'
    //   }
    // }
  });

  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-csso');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build2', ['jst', 'uglify:public2', 'csso', 'htmlmin:build2']);

  grunt.registerTask('default', ['uglify', 'concat', 'htmlmin:dist', 'preprocess', 'csso', 'htmlmin:finalc']);
};
