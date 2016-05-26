/*jshint node: true */

module.exports = function (grunt) {

  'use strict';

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      dist: {
        src: [
          'src/start.frag',
          'src/main.js',
          'src/completer.js',
          'src/dropdown.js',
          'src/strategy.js',
          'src/adapter.js',
          'src/textarea.js',
          'src/ie_textarea.js',
          'src/content_editable.js',
          'src/ckeditor.js',
          'src/vendor/textarea_caret.js',
          'src/end.frag'
        ],
        dest: 'dist/jquery.textcomplete.js'
      }
    },

    uglify: {
      options: {
        banner:
          '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */',
        sourceMap: 'dist/jquery.textcomplete.min.map'
      },
      all: {
        files: {
          'dist/jquery.textcomplete.min.js': [
            'dist/jquery.textcomplete.js'
          ]
        }
      }
    },

    connect: {
      server: {
        options: {
          port: 8000,
          base: '../'
        }
      }
    },

    watch: {
      all: {
        files: ['src/*.js'],
        tasks: ['concat', 'uglify']
      }
    }
  });

  grunt.registerTask('default', ['connect', 'watch']);
  grunt.registerTask('build', ['concat', 'uglify']);
};
