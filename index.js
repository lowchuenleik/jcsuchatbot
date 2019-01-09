'use strict';
process.env.PAGE_ACCESS_TOKEN = "***REMOVED***"

// Imports dependencies and set up http server
const
  PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // creates express http server
  const request = require('request');

// Handles messages events
function handleMessage(sender_psid, received_message) {

    let response;
  
    // Check if the message contains text
    if (received_message.text) {    
  
      // Create the payload for a basic text message
      response = {
        "text": `You sent the message: "${received_message.text}". Now send me an image!`
      }
    }  
    
    // Sends the response message
    callSendAPI(sender_psid, response);    
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
      "recipient": {
        "id": sender_psid
      },
      "message": response
    }
  }


// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
 
    let body = req.body;
    //const VERIFY_TOKEN = "<YOUR_VERIFY_TOKEN>";

    // Checks this is an event from a page subscription
    if (body.object === 'page') {
  
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {
  
        // Gets the message. entry.messaging is an array, but 
        // will only ever contain one message, so we get index 0
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);

        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        console.log('Sender PSID: ' + sender_psid);

        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhook_event.message) {
            handleMessage(sender_psid, webhook_event.message);        
        } else if (webhook_event.postback) {
            handlePostback(sender_psid, webhook_event.postback);
        }

      });
  
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  
  });

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "***REMOVED***"
      
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
      
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
    
      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);      
      }
    }
  });

app.get('/',function(req,res) {
    res.send("HI I am a chatbot")
})

/*

//CUrl messages

https://calm-coast-92557.herokuapp.com/  <- HEROKU URL

curl -H "Content-Type: application/json" -X POST "localhost:1337/webhook" -d "{""object"": ""page"", ""entry"": [{""messaging"": [{""message"": ""TEST_MESSAGE""}]}]}"
curl -H "Content-Type: application/json" -X POST "https://calm-coast-92557.herokuapp.com/webhook" -d "{""object"": ""page"", ""entry"": [{""messaging"": [{""message"": ""TEST_MESSAGE""}]}]}"

curl -X GET "localhost:1337/webhook?hub.verify_token=***REMOVED***&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe"
curl -X GET "https://calm-coast-92557.herokuapp.com/webhook?hub.verify_token=***REMOVED***&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe"


'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.set('port',(process.env.PORT || 5000))

//Allows processing of data
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//ROUTES


// facebook security thing
app.get('/webhook/',function(req,res){
    if (req.query['hub.verify_token'] == "***REMOVED***"){
        res.send(req.query['hub.challenge'])
    }
    res.send("Wrong token")
})



app.listen(app.get('port'),function(){
    console.log("running:port")
})

*/