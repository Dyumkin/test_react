'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    apidoc: {
      todolist: {
        src: 'controllers/actions/',
        dest: 'public/documentation/api/',
        options: {
          includeFilters: [".*\\.js$"],
          excludeFilters: ["node_modules/"]
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-apidoc');
  grunt.registerTask('default', ['apidoc']);
};