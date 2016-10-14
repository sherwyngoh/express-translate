var express     = require('express');
var router      = express.Router();
var config      = require('config');
var dbURL       = config.get('mongoURL');
var request     = require('request');
var MongoClient = require('mongodb').MongoClient;

/* 
  Yandex Translate API Usage
  POST:
    https://translate.yandex.net/api/v1.5/tr.json/translate?
  REQUIRED PARAMS:
    & key=<API key>
    & text=<text to translate> -> "some text"
    & lang=<translation direction> -> "en-cn"
  NON-REQUIRED PARAMS:
    & [format=<text || html>]
    & [options=<translation>] 
      -> 1 will assess the language of text given
    & [callback=<name of the callback function>]
*/

router.post('/', function(req, res, next) {
  var text = req.body.text;
  var from = req.body.from;
  var to   = req.body.to;

  MongoClient.connect(dbURL, null, function(err, db) {
    var collection = db.collection(from + "-" + to);
    collection.findOne({[text]: {'$exists': 1}}, function(err, result){
      if (err) { res.send({text: ''}) }

      if (result) {
        res.send({text: result[text][0]})
      } else {
        var options = {
          url: "https://translate.yandex.net/api/v1.5/tr.json/translate",
          form: {
            key: config.get("YandexAPIkey"),
            text: text,
            lang: from + "-" + to
          }
        };

        function callback(err, response, body) {
          var r = JSON.parse(body)
          if (r.code == 200) {
            var translatedText = r.text;
            collection.insert({[text]: translatedText});
            res.send({text: translatedText});
          } else {
            res.send({text: ''});
          }
        }

        request.post(options, callback);
      }
    });
  });
});

module.exports = router;
