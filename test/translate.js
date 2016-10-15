var app     = require("../app"),
supertest   = require('supertest')(app),
assert      = require('assert'),
sinon       = require('sinon'),
request     = require('request'),
config      = require('config'),
MongoClient = require('mongodb').MongoClient;

var translateURL = config.get("yandexTranslateAPIURL");
var detectURL    = config.get("yandexDetectAPIURL");

describe('routes: /translate', function() {
  describe('POST /', function() {
    var defaultResponse = {text: ''}
    var url             = 'translate'

    it('should return the same <text> if language submitted is the same as the <to> language', function(done) {
      var errorStub        = null,
        responseStub       = null;
        randomResponse     = Math.random().toString(36).substr(2, 5);
        randomLanguage     = Math.random().toString(36).substr(2, 3);

      var formData = {
        from: 'doesnt matter in this case',
        to: randomLanguage,
        text: randomResponse
      };

      var requestStub = sinon.stub(request, 'post', function(options, callback) {
        if (options.url === detectURL) {
          var bodyStub = JSON.stringify({ lang: randomLanguage , code: 200})
          callback(errorStub, responseStub, bodyStub);

        } else if (options.url === translateURL) {
          var bodyStub = JSON.stringify({ text: randomResponse , code: 200})
          callback(errorStub, responseStub, bodyStub);
        } 
      });

      supertest.post('/translate')
        .type('form')
        .set('Accept', 'application/json')
        .send(formData)
        .end(function(err, res) {
          assert.equal(res.body.text, randomResponse)
          done()
        });
    });
  });
});