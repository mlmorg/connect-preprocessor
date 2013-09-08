'use strict';

var pkg = require('./package.json');
var preprocessor = require('./lib/middleware');

module.exports = function (grunt) {

  grunt.initConfig({

    connect: {
      test: {
        options: {
          middleware: function () {
            return [
              preprocessor('jade', { src: 'test/fixtures' }),
              preprocessor('jade', { src: 'test/fixtures' }, { client: true }),
              preprocessor('coffee', { src: 'test/fixtures' })
            ];
          }
        },
      }
    },

    jshint: {
      all: ['Gruntfile.js', 'lib/**/*.js', 'test/unit/**/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        forin: true,
        immed: true,
        indent: 2,
        latedef: true,
        newcap: true,
        noarg: true,
        plusplus: true,
        undef: true,
        unused: true,
        strict: true,
        trailing: true,
        browser: true,
        node: true,
        expr: true,
        globals: {
          describe: true,
          before: true,
          after: true,
          beforeEach: true,
          afterEach: true,
          it: true,
          expect: true,
          assert: true,
          sinon: true
        }
      }
    },

    mochacli: {
      all: ['test/config.js', 'test/unit/**/*.js'],
      options: {
        reporter: 'spec'
      }
    }

  });

  var name;
  for (name in pkg.devDependencies) {
    if (name.substring(0, 6) === 'grunt-') {
      grunt.loadNpmTasks(name);
    }
  }

  grunt.registerTask('test', ['connect', 'mochacli']);
  grunt.registerTask('default', ['jshint', 'test']);
};
