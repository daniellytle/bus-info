'use strict';
module.change_code = 1;
var _ = require('lodash');
// var moment = require('moment')
var https = require('https');
var moment = require('moment');
var Alexa = require('alexa-app');
var app = new Alexa.app('bus-info');

var optionsget = {
    host : 'maps.googleapis.com',
    port : 443,
    path : '/maps/api/directions/json?origin=CCL+Science+Building&destination=PierpontCommons&mode=transit&key=AIzaSyBh08Vf7_9a7eLWdpidsIkJmR30vNFwEpw',
    method : 'GET'
};

function getDirections(optionsget) {
  return new Promise(function(resolve, reject) {
    var reqGet = https.request(optionsget, function(res) {
      var finalData = "";

      res.on('data', function(d) {
        finalData += d.toString();
      });

      res.on("end", function() {
        var obj = JSON.parse(finalData);
        resolve(obj);
      });
    });

    reqGet.on('error', function(e) {
      console.log("Got error: ", e);
      reject(e);
    });
    reqGet.end();
  })
}

function resolveData(data) {
  // console.log(data);

  var speech = "The next to north leaves ";
  var bus_deets = data.routes[0].legs[0].steps[0].transit_details;
  var bus_name = bus_deets.line.name;
  var depart_time = moment(bus_deets.departure_time.value, 'X').fromNow();
  console.log(bus_deets)
  var depart_stop = bus_deets.departure_stop.name;
  console.log();

  return "The next " + bus_name + " leaves CC Little " + depart_time;
}

app.launch(function(req, res) {
  var prompt = 'Hello, ask me for the next bus leaving CC Little';
  res.say(prompt).shouldEndSession(false);
});

app.intent('bus',
  {
    "utterances":[ "when is the next bus" ]
  }
, function(req, res) {
    //get the slot
    return getDirections(optionsget).then(function(data) {
      console.log("lkj", data)

      var speech = resolveData(data);
      res.say(speech).send();
    });


});
//hack to support custom utterances in utterance expansion string
console.log(app.utterances().replace(/\{\-\|/g, '{'));
module.exports = app;
