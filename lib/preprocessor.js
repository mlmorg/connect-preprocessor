'use strict';

var _ = require('underscore');
var fs = require('fs');
var path = require('path');

exports = module.exports = function (compiler, options) {
  // Get the compiler
  this.compiler = compiler;

  // Default options
  this.options = options = _.extend({
    src: './',
    opts: {}
  }, options);

  // Set the extensions
  if (!options.ext) { options.ext = this._compilerSetting('ext'); }
  if (!options.compExt) { options.compExt = this._compilerSetting('compExt'); }

  // Set the regex pattern to match
  this.compExtPattern = new RegExp('\\' + options.compExt + '$');
  options.pattern = options.pattern || this.compExtPattern;

  // Set the mime type
  options.mime = options.mime || this._coerceMime(options.compExt);
};

exports.prototype.exists = function (url, callback) {
  if (this.options.pattern.test(url)) {
    fs.exists(this._getFilepath(url), callback);
  } else {
    callback(false);
  }
};

exports.prototype.compile = function (url, callback) {
  var that = this;
  var filepath = this._getFilepath(url);
  fs.readFile(filepath, { encoding: 'utf8' }, function (err, file) {
    if (err) {
      return callback(err);
    }
    that.compiler.compile(file, that.options.opts, callback);
  });
};

exports.prototype.getMime = function () {
  return this.options.mime;
};

exports.prototype._getFilepath = function (url) {
  var filepath = path.join(this.options.src, url);
  return filepath.replace(this.compExtPattern, this.options.ext);
};

exports.prototype._compilerSetting = function (setting) {
  var method = this.compiler[setting];
  if (_.isString(method)) {
    return method;
  }
  return this.compiler[setting](this.options.opts);
};

exports.prototype._coerceMime = function (ext) {
  var mime;
  switch (ext) {
  case '.js':
    mime = 'application/javascript';
    break;
  case '.html':
    mime = 'text/html';
    break;
  case '.css':
    mime = 'text/css';
    break;
  }
  return mime;
};
