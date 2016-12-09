// jshint esversion: 6
var Keys = require('../keys');
var SMSResponses = require('./responses');
var twilio = require('twilio')(Keys.twilio.TWILIO_ACCOUNT_SID, Keys.twilio.TWILIO_AUTH_TOKEN);


//===========send welcome message ====================//

exports.sendWelcome = function(userPhoneNumber) {
  console.log(userPhoneNumber);

  twilio.sendMessage({
    to: `+1${userPhoneNumber}`, // Any number Twilio can deliver to
    from: '+14152003022', // A number you bought from Twilio and can use for outbound communication
    body: 'Welcome to Hassle, loser.' // body of the SMS message

  }, function(err, responseData) { //this function is executed when a response is received from Twilio
    if (!err) { // "err" is an error received during the request, if any
      console.log(responseData.from); // outputs "+14506667788"
      console.log(responseData.body); // outputs "word to your mother."

    }
  });
};


//=========== outbound period question service ====================//

exports.periodicGoalPoll = function(userPhoneNumber, userGoal) {
  twilio.sendMessage({
    to: `+1${userPhoneNumber}`, // Any number Twilio can deliver to
    from: '+14152003022', // A number you bought from Twilio and can use for outbound communication
    body: `Did you make progress towards your goal? ## ${userGoal} ## Respond 1 for 'yes' -or- 2 for 'no'.` //,
      //  mediaUrl: 'https://s-media-cache-ak0.pinimg.com/originals/53/e6/eb/53e6eb8b9396ee2c1cc99b69582a07f3.jpg'
      // body of the SMS message
  }, function(err, responseData) { //this function is executed when a response is received from Twilio

    if (!err) { // "err" is an error received during the request, if any
      console.log("reponse from user's phone number:");
      console.log(responseData.body); // outputs "word to your mother."

    }
  });
};



//=========== respond to messages ====================//


exports.responseMaker = function(req, res) {

  var twilio = require('twilio');
  var twiml = new twilio.TwimlResponse();

  console.log("sms responses", SMSResponses.positiveResponses);


  var randomPositive= Math.floor(Math.random() * SMSResponses.positiveResponses.length);

  var randomNegative= Math.floor(Math.random() * SMSResponses.negativeResponses.length);

  if (req.query.Body == 1) {
    twiml.message(SMSResponses.positiveResponses[randomPositive]);
  } else if (req.query.Body == 2) {
    twiml.message(SMSResponses.negativeResponses[randomNegative]);
    // twiml.mediahttps: //s-media-cache-ak0.pinimg.com/originals/53/e6/eb/53e6eb8b9396ee2c1cc99b69582a07f3.jpg
  } else {
    twiml.message(`dude, it's 1 or 2 for a response...`);
  }
  res.writeHead(200, {
    'Content-Type': 'text/xml'
  });
  res.end(twiml.toString());

};



//=========== get last inbound response not tied to user ====================//


exports.getLastResponse = function() {

  var lastResponse;

  var promise = new Promise(function(resolve, reject) {

    twilio.messages.list(function(err, data) {
      console.log(data.messages[1].body);
      lastResponse = data.messages[1].body;
      //go to db
      resolve(data);
    });
    return promise;
  })
  .then(function(data) {
    if (lastResponse === "1") {
      twilio.sendMessage({
        to: `+1${6468318760}`, // Any number Twilio can deliver to
        from: '+14152003022', // A number you bought from Twilio and can use for outbound communication
        body: `you must be very proud of yourself` // body of the SMS message
      }, function(err, responseData) { //this function is executed when a response is received from Twilio
        if (!err) { // "err" is an error received during the request, if any
          console.log(responseData.body); // outputs "word to your mother."
        }
      });

    }

    if (lastResponse === "2") {
      console.log('two selected');
      twilio.sendMessage({
        to: `+1${6468318760}`, // Any number Twilio can deliver to
        from: '+14152003022', // A number you bought from Twilio and can use for outbound communication
        body: `wow you suck at this` // body of the SMS message
      }, function(err, responseData) { //this function is executed when a response is received from Twilio
        if (!err) { // "err" is an error received during the request, if any
          console.log(responseData.body); // outputs "word to your mother."
        }
      });
    }
  });

};


//=========== get all message history for testing ====================//
exports.getAllMessages = function() {
  twilio.messages.list(function(err, data) {
    data.messages.forEach(function(message) {
      console.log(message.body);
    });
  });
};
