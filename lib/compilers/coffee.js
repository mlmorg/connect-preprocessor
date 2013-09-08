'use strict';

var coffee = require('coffee-script');

exports.ext = '.coffee';
exports.compExt = '.js';

exports.compile = function (text, options, callback) {
  var compiled = coffee.compile(text, options);
  callback(null, compiled);
};
