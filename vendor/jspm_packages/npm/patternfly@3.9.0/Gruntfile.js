/* */ 
module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  var projectConfig = {
    dist: 'dist',
    src: ''
  };
  try {
    projectConfig.src = require('./bower.json!systemjs-json').appPath || projectConfig.src;
  } catch (e) {}
  grunt.initConfig({
    clean: {build: '<%= config.dist %>'},
    config: projectConfig,
    connect: {server: {options: {
          hostname: '0.0.0.0',
          livereload: true,
          base: [projectConfig.src, projectConfig.dist + '/tests'],
          port: 9000
        }}},
    copy: {
      main: {files: [{
          expand: true,
          cwd: 'components/bootstrap/dist/fonts/',
          src: ['*'],
          dest: 'dist/fonts/'
        }, {
          expand: true,
          cwd: 'components/font-awesome/fonts/',
          src: ['*'],
          dest: 'dist/fonts/'
        }, {
          expand: true,
          cwd: 'src/fonts/',
          src: ['*'],
          dest: 'dist/fonts/'
        }, {
          expand: true,
          cwd: 'components/bootstrap/less/',
          src: ['**'],
          dest: 'less/lib/bootstrap/'
        }, {
          expand: true,
          cwd: 'components/font-awesome/less/',
          src: ['**'],
          dest: 'less/lib/font-awesome/'
        }, {
          expand: true,
          cwd: 'components/bootstrap-combobox/less/',
          src: ['**'],
          dest: 'less/lib/bootstrap-combobox/'
        }, {
          expand: true,
          cwd: 'components/bootstrap-datepicker/less/',
          src: ['**'],
          dest: 'less/lib/bootstrap-datepicker/'
        }, {
          expand: true,
          cwd: 'components/bootstrap-select/less/',
          src: ['**'],
          dest: 'less/lib/bootstrap-select/'
        }, {
          expand: true,
          cwd: 'components/bootstrap-touchspin/dist/',
          src: ['jquery.bootstrap-touchspin.css'],
          dest: 'less/lib/bootstrap-touchspin/'
        }, {
          expand: true,
          cwd: 'components/c3/',
          src: ['c3.css'],
          dest: 'less/lib/c3/'
        }, {
          expand: true,
          cwd: 'src/img/',
          src: ['**'],
          dest: 'dist/img/'
        }]},
      js: {files: [{
          expand: true,
          cwd: 'src/js/',
          src: ['patternfly.js'],
          dest: 'dist/js/'
        }]}
    },
    csscount: {production: {
        src: ['dist/css/patternfly*.min.css'],
        options: {maxSelectors: 4096}
      }},
    cssmin: {production: {
        files: [{
          expand: true,
          cwd: 'dist/css',
          src: ['patternfly*.css', '!*.min.css'],
          dest: 'dist/css',
          ext: '.min.css'
        }],
        options: {sourceMap: true}
      }},
    jekyll: {
      options: {src: 'tests/pages'},
      tests: {options: {dest: 'dist/tests'}}
    },
    jslint: {client: {
        src: ['src/js/patternfly.js'],
        directives: {
          node: false,
          browser: true,
          nomen: true,
          todo: true,
          unparam: true,
          predef: ['jQuery', 'Event'],
          indent: 2
        }
      }},
    less: {
      patternfly: {
        files: {'dist/css/patternfly.css': 'less/patternfly.less'},
        options: {
          paths: ['less/'],
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapFilename: 'dist/css/patternfly.css.map',
          sourceMapURL: 'patternfly.css.map'
        }
      },
      patternflyAdditions: {
        files: {'dist/css/patternfly-additions.css': 'less/patternfly-additions.less'},
        options: {
          paths: ['less/'],
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapFilename: 'dist/css/patternfly-additions.css.map',
          sourceMapURL: 'patternfly-additions.css.map'
        }
      }
    },
    uglify: {
      options: {mangle: false},
      production: {files: {'dist/js/patternfly.min.js': ['src/js/patternfly.js']}}
    },
    watch: {
      copy: {
        files: 'components/**/*',
        tasks: ['copy']
      },
      jekyll: {
        files: 'tests/pages/**/*',
        tasks: ['jekyll']
      },
      less: {
        files: 'less/*.less',
        tasks: ['less']
      },
      css: {
        files: ['dist/css/patternfly*.css', 'dist/css/!*.min.css'],
        tasks: ['cssmin', 'csscount']
      },
      js: {
        files: ['src/js/*.js'],
        tasks: ['jslint', 'uglify', 'copy:js']
      },
      livereload: {files: ['dist/css/*.css', 'dist/js/*.js', 'dist/tests/*.html', '!tests/pages/*.html']},
      options: {livereload: true}
    },
    karma: {unit: {configFile: 'karma.conf.js'}}
  });
  grunt.registerTask('build', ['copy', 'jekyll', 'less', 'cssmin', 'csscount', 'jslint', 'uglify']);
  grunt.registerTask('server', ['connect:server', 'watch']);
  grunt.registerTask('default', ['build']);
};
