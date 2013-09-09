'use strict';

var less = require('less');

exports.ext = '.less';
exports.compExt = '.css';

exports.compile = function (text, options, callback) {
  var parser = new less.Parser(options);
  parser.parse(text, function (err, tree) {
    if (err) {
      return callback(err);
    }

    var css = tree.toCSS(options);
    callback(null, css);
  });
};
