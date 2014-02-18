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
      html: {
        src: 'public/index.grunt.html',
        dest: 'public/index.html'
      }
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
    }
  });

  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-csso');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');

  grunt.registerTask('default', ['uglify', 'concat', 'htmlmin:dist', 'preprocess', 'csso', 'htmlmin:finalc']);

};
