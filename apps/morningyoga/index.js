'use strict';
module.change_code = 1;
var _ = require('lodash');
// var moment = require('moment')
var https = require('https');
var Alexa = require('alexa-app');
var app = new Alexa.app('morningyoga');

// Dictionary
app.dictionary = {
  "SESSION_TYPE": ['quick', 'regular']
}

app.launch(function(req, res) {
  var prompt = 'Hello, would you like to start a session';
  res.say(prompt).shouldEndSession(false);
});

app.intent('start',
  {
    "slots": { "type": "SESSION_TYPE" },
    "utterances":[ "Start a session" ]
  }
, function(req, res) {
    //get the slot
    res.say("alright, let's start a  session").shouldEndSession(false);

    var stream = {
        "url": "https://www.youtube.com/watch?v=khDyWeZGb4w",
        "offsetInMilliseconds": 0
      };
    res.audioPlayerPlayStream("ENQUEUE", stream);
    console.log('stillchilld')
});
//hack to support custom utterances in utterance expansion string
console.log(app.utterances().replace(/\{\-\|/g, '{'));
module.exports = app;
