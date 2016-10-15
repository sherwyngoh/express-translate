var app   = require("../app"),
supertest = require('supertest')(app),
assert    = require('assert');

describe('routes/index', function() { 
  var defaultResponse = {text: ""}

  describe("GET /", function() {
    it('should return default response', function(done) {
      supertest
          .get('/')
          .expect(200) 
          .expect('Content-Type', /text\/html/)
          .end(done);
    });
  });
});