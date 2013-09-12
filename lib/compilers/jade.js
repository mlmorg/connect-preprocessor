'use strict';

var jade = require('jade');

exports.ext = '.jade';

exports.compExt = function (options) {
  return options.client ? '.js' : '.html';
};

exports.compile = function (text, options, callback) {
  try {
    var fn = jade.compile(text, options);
    var html;
    if (options.client) {
      html = fn.toString();
      if (options.amd) {
        html = "define(['jade'], function(jade) { " +
          "if(jade && jade['runtime'] !== undefined) { jade = jade.runtime; }" +
          "\nreturn " + html + "\n});";
      }
    } else {
      html = fn(options.data);
    }
    callback(null, html);
  } catch (e) {
    callback(e);
  }
};
