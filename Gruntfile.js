module.exports = function(grunt) {

	grunt.initConfig({
    // Task configuration.
    ngAnnotate: {
        demo: {
            files: {
                'WithAnnotationsCtrl.js': ['WithoutAnnotationsCtrl.js']
            },
        }
    }
  });
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('ngAnnotate');
  grunt.loadNpmTasks('ngAnnotate');

  grunt.registerTask('default', ['ngAnnotate']);

};