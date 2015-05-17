module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    csso: {
      dist: {
        files: {
          'public/build/style.css': [
            'public/stylesheets/*.css'
          ]
        }
      }
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

  grunt.loadNpmTasks('grunt-csso');
  grunt.loadNpmTasks("grunt-image-embed");

  grunt.registerTask('default', [
    'csso', 'imageEmbed'
  ]);
};
