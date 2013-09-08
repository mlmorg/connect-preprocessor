'use strict';

var jade = require('jade');

exports.ext = '.jade';

exports.compExt = function (options) {
  return options.client ? '.js' : '.html';
};

exports.compile = function (text, options, callback) {
  var fn = jade.compile(text, options);
  var html = fn(options.data);
  callback(null, html);
};
