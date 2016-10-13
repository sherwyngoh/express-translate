var express = require('express');
var router  = express.Router();
var config  = require('config');
var request = require('request');

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
  var options = {
    url: "https://translate.yandex.net/api/v1.5/tr.json/translate",
    form: {
      key: config.get("YandexAPIkey"),
      text: req.body.textToTranslate,
      lang: req.body.from + "-" + req.body.to
    }
  };

  function callback(err, response, body) {
    var translatedText = JSON.parse(body).text
    res.send({text: translatedText[0]});
  };

  request.post(options, callback);
});

module.exports = router;
