'use strict';

var fs = require('fs');
var http = require('http');
var path = require('path');

describe('connect-preprocessor', function () {

  var code, body, expected, mime;

  var get = function (path, callback) {
    path = path || '';
    http.get('http://127.0.0.1:8000' + path, function (response) {
      var body = '';
      response.on('data', function (data) {
        body += data;
      });
      response.on('end', function () {
        callback(response.statusCode, response.headers['content-type'], body);
      });
    });
  };

  var fixture = function (filename) {
    var filepath = path.join(__dirname, '../', 'fixtures', filename);
    return fs.readFileSync(filepath, 'utf8');
  };

  describe('no file exists', function () {

    before(function (done) {
      get('/error', function (status) {
        code = status;
        done();
      });
    });

    it('should pass through to next middleware', function () {
      expect(code).to.eql(404);
    });

  });

  describe('loading html with jade preprocessor', function () {

    before(function (done) {
      expected = fixture('index_expected.html');
      get('/', function (status, type, data) {
				mime = type;
        body = data;
        done();
      });
    });

    it('should return a compiled html file', function () {
      expect(body).to.eql(expected);
    });

		it('should have html mime type', function () {
			expect(mime).to.eql('text/html');
		});

  });

  describe('loading js with jade preprocessor', function () {
    
    before(function (done) {
      expected = fixture('jade_templates_expected.js');
      get('/jade_templates.js', function (status, type, data) {
        mime = type;
        body = data;
        done();
      });
    });

    it('should return a compiled js file', function () {
      expect(body).to.eql(expected);
    });

    it('should have js mime type', function () {
      expect(mime).to.eql('application/javascript');
    });
  });

});
