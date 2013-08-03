module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    preprocess: {
      options: {
        context: {
          DEBUG: true
        }
      },
      html: {
        src: 'public/index.grunt.html',
        dest: 'public/index.html'
      }
    }
  });

  grunt.loadNpmTasks('grunt-preprocess');

  grunt.registerTask('default', ['preprocess']);

};
