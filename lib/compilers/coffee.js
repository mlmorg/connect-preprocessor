'use strict';

var coffee = require('coffee-script');

exports.ext = '.coffee';
exports.compExt = '.js';

exports.compile = function (text, options, callback) {
  var compiled, error;
  try {
    compiled = coffee.compile(text, options);
  } catch (e) {
    error = new Error(e.message + ' at line ' + e.location.first_line + ' in file ' + options.filename);
  }

  if (error) {
    return callback(error);
  }

  callback(null, compiled);
};
