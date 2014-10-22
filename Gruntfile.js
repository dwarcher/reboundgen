'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    animationData: grunt.file.readJSON("data/data.json"),
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
      },
      dist: {
        files: [{
          'dist/reboundgen.css': 'dist/reboundgen.scss'
        }]
      }
    },
    cssmin: {
      testpage: {
        files: {
          'examples/styles.min.css': 'examples/styles.css',
        }
      },
      dist: {
        files: [{
          'dist/reboundgen.min.css': 'dist/reboundgen.css'
        }]
      }
    },
    'compile-handlebars': {
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
        files: [ 'data/data.json', 'examples/styles.scss' ],
        tasks: [ 'build' ]
      },
      html: {
        files: [ 'examples/index.handlebars'],
        tasks: [ 'compile-handlebars' ],
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
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task.
  grunt.registerTask('build', ['nodeunit', 'compile-handlebars', 'sass', 'cssmin' ]);
  grunt.registerTask('default', ['nodeunit']);

};
