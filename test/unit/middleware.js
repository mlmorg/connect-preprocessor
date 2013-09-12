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

    describe('when an error exists in the jade', function () {
      
      before(function (done) {
        get('/jade_errors.html', function (status) {
          code = status;
          done();
        });
      });

      it('should return a 500', function () {
        expect(code).to.eql(500);
      });

    });

  });

  describe('loading js with jade preprocessor', function () {
    
    before(function (done) {
      expected = fixture('jade_client_expected.js');
      get('/jade_client.js', function (status, type, data) {
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

    describe('when amd option is true', function () {
      
      before(function (done) {
        expected = fixture('jade_amd_expected.js');
        get('/jade_amd.js', function (status, type, data) {
          body = data;
          done();
        });
      });

      it('should return the compiled js file wrapped in amd', function () {
        expect(body).to.eql(expected);
      });

    });
  });

  describe('loading js with coffee preproecssor', function () {

    before(function (done) {
      expected = fixture('coffee_expected.js');
      get('/coffee.js', function (status, type, data) {
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

    describe('on the second request', function () {

      before(function (done) {
        get('/coffee.js', function (status, type, data) {
          mime = type;
          body = data;
          done();
        });
      });

      it('should not alter options hash', function () {
        expect(body).to.eql(expected);
      });
    });

    describe('when there are errors in the coffee', function () {

      before(function (done) {
        get('/coffee_errors.js', function (status, type, data) {
          code = status;
          done();
        });
      });

      it('should return a 500', function () {
        expect(code).to.eql(500);
      });

    });

  });

  describe('loading file with query parameters', function () {
    
    before(function (done) {
      expected = fixture('coffee_expected.js');
      get('/coffee.js?foo=bar', function (status, type, data) {
        body = data;
        done();
      });
    });

    it('should disregard the query parameters', function () {
      expect(body).to.eql(expected);
    });

  });

  describe('loading css with less preprocessor', function () {

    before(function (done) {
      expected = fixture('less_expected.css');
      get('/less.css', function (status, type, data) {
        mime = type;
        body = data;
        done();
      });
    });

    it('should return a compiled css file', function () {
      expect(body).to.eql(expected);
    });

    it('should have css mime type', function () {
      expect(mime).to.eql('text/css');
    });

    describe('when there are errors in the less', function () {

      before(function (done) {
        get('/less_errors.css', function (status, type, data) {
          code = status;
          done();
        });
      });

      it('should return a 500', function () {
        expect(code).to.eql(500);
      });

    });

  });

});
