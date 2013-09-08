'use strict';

var jade = require('jade');

exports.ext = '.jade';

exports.compExt = function (options) {
  return options.client ? '.js' : '.html';
};

exports.compile = function (text, options, callback) {
  var fn = jade.compile(text, options);
  var html = options.client ? fn.toString() : fn(options.data);
  callback(null, html);
};
