var express     = require('express');
var router      = express.Router();
var config      = require('config');
var request     = require('request');
var MongoClient = require('mongodb').MongoClient;

var dbURL        = config.get('mongoURL');
var translateURL = config.get("yandexTranslateAPIURL");
var detectURL    = config.get("yandexDetectAPIURL");
var apikey       = config.get("yandexAPIkey");

function checkParameters(from, to, text) {
  var valid = true;
  var params = [from, to, text];

  for (var i = 0; i < params.length; i++) {
    valid  = !!params[i] && params[i].length > 0;
  }

  valid = valid && (from != to);

  return valid
}

/* 
  Yandex Detect API Usage
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

function performLanguageDetection(res, from, to ,text) {
  var options = {
    url: detectURL,
    form: {
      key: apikey,
      text: text,
      hint: 'en,fr,es'
    }
  }

  function callback(err, response, body) {
    var r = JSON.parse(body);
    if (r.code === 200) {
      var lang = r.lang;

      if (lang.toUpperCase() === to.toUpperCase()) {
        res.send({ text: text });
      } else {
        checkIfExistsInDatabase(res, from, to, text);
      }
    } else {
      res.status(500).send("Lang Detect: Failed to communicate with Yandex server")
    }
  }

  request.post(options, callback);
}

function checkIfExistsInDatabase(res, from, to, text) {
  MongoClient.connect(dbURL, null, function(err, db) {
    var collection = db.collection(from + "-" + to);

    collection.findOne({ [text]: { '$exists': 1 } }, function(err, result) {
      if (err) { res.send({ text: '' }) }

      if (result) {
        res.send({ text: result[text][0] });
      } else {
        queryYandexTranslateAPI(res, collection, from, to, text);
      }
    });
  });
}

/*
  Yandex Translate API Usage
  POST:
    https://translate.yandex.net/api/v1.5/tr.json/translate?
  REQUIRED PARAMS:
    & key=<API key>
    & text=<text to translate> -> "some text"
  NON-REQUIRED PARAMS:
    & [hint=<list of probably text language == en,de>]
    & [callback=<function name>]
*/

function queryYandexTranslateAPI(res, collection, from, to, text) {
  var options = {
    url: translateURL,
    form: {
      key: apikey,
      text: text,
      lang: from + "-" + to
    }
  }

  function callback(err, response, body) {
    var r = JSON.parse(body);
    console.log(r)

    if (r.code == 200) {
      var translatedText = r.text;
      collection.insert({ [text]: translatedText });
      res.send({ text: translatedText });
    } else {
      res.status(500).send("Failed to communicate with Yandex server")
    }
  }

  request.post(options, callback);
}

router.post('/', function(req, res, next) {
  var text = req.body.text,
      from = req.body.from,
      to   = req.body.to;

  var valid_params = checkParameters(from, to, text);

  if (valid_params) {
    performLanguageDetection(res, from, to, text);
    // if necessary, will then checkIfExistsInDatabase,
    // and then possibly queryYandexTranslateAPI.
  } else {
    res.send({ text: '' });
  }

});

module.exports = router;
