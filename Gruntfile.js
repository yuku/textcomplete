/*jshint node: true */

module.exports = function (grunt) {

  'use strict';

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      all: {
        files: {
          'jquery.textcomplete.min.js': [
            'jquery.textcomplete.js'
          ]
        }
      }
    }
  });

  grunt.registerTask('default', ['uglify']);
};
