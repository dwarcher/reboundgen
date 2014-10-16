'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    animationData: grunt.file.readJSON("test/data.json"),
    nodeunit: {
      files: ['test/**/*_test.js'],
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['lib/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      },
    },
    sass: {
      testpage: {
        files: {
          'examples/styles.css': 'examples/styles.scss'
        }
      }
    },
    'compile-handlebars': {
      styles: {
        template: 'examples/styles.scss.handlebars',
        templateData: '<%= animationData %>',
        output: 'examples/styles.scss'
      },
      example: {
        template: 'examples/index.handlebars',
        templateData: '<%= animationData %>',
        output: 'examples/index.html',
      },
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: [ 'build' ]
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: [ 'build' ]
      },
      animations: {
        files: [ 'test/data.json', 'examples/styles.scss' ],
        tasks: [ 'build' ]
      },
      html: {
        files: [ 'examples/index.html'],
        options: {
            livereload: true,
        }
    },
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-compile-handlebars');
  grunt.loadNpmTasks('grunt-contrib-sass');

  // Default task.
  grunt.registerTask('build', ['nodeunit', 'compile-handlebars', 'sass', ]);
  grunt.registerTask('default', ['nodeunit']);

};
