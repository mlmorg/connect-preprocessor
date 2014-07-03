'use strict';

var _ = require('underscore');
var path = require('path');
var Preprocessor = require('./preprocessor');
var url = require('url');

module.exports = function (compiler, options, compilerOpts) {
  if (!compiler) {
    throw new Error('A compile type must be passed to connect-preprocessor');
  }

  // Default options
  options = _.extend({
    opts: compilerOpts || {},
    index: 'index.html'
  }, options);

  // Load up the compiler
  if (_.isString(compiler)) {
    compiler = require(path.join(__dirname, 'compilers', compiler));
  }

  // Create the preprocessor
  var preprocessor = new Preprocessor(compiler, options);

  return function (req, res, next) {
    // Disregard query parameters
    req.url = url.parse(req.url).pathname;

    // Route to the index if loading a directory
    if (options.index && /\/$/.test(req.url)) {
      req.url = path.join(req.url, options.index);
    }

    // Determine whether the current requested file exists
    preprocessor.exists(req.url, function (exists) {
      if (!exists) {
        return next();
      }

      // Compile the file and respond
      preprocessor.compile(req.url, function (err, compiled) {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          return res.end(err.toString());
        }

        res.writeHead(200, { 'Content-Type': preprocessor.getMime() });
        res.end(compiled);
      });
    });
  };
};
