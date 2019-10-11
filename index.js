'use strict';
process.env.PAGE_ACCESS_TOKEN = "***REMOVED***"

process.env.VERIFY_TOKEN = "***REMOVED***"

// Imports dependencies and set up http server
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const express = require('express');
const bodyParser = require('body-parser');
const app = express().use(bodyParser.json()); // creates express http server

app.use(express.static(__dirname + '/img/'));

const request = require('request');

const responses = {
  medical:"For any medical-related queries you can contact our college nurse at college-nurse@jesus.cam.ac.uk and book an appointment there! Her hours vary and can be found posted outside her door in Library Court I. If you are seeking urgent medical help or advice, please visit your GP as soon as possible",
  compsci:"The shortened name for Computer Science or a Computer Scientist",
  classlist:"Each year, the results from all exams are published in class lists. As of last year, you are now able to opt-out of having your results made public.",
  asnac:"An acronym for 🤔Anglo-Saxon, Norse and Celtic – a Cambridge course",
  meal:"See attached for the meal timetables!",
  contact:"Please visit https://www.jesus.cam.ac.uk/college/people/staff-and-departments for contact details!"
}

function firstEntity(nlp, name) {
  return nlp && nlp.entities && nlp.entities.intent && nlp.entities.intent[0];
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  let response;
  
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  switch (payload){
    case 'medical': 
      response = {
        "text": `In response to"${received_message.text}". \n ${responses.medical}`
      };
      break;

    case 'meal':
      response = {
        "attachment": {
          "type": "image",
          "payload": {
            "attachment_id": 711364085956528
          }
        }
      }
      break;
    
    case 'contact':
      response = {
        "text" : responses.contact
      };
      break;

    default:
      response = {
        "text" : "Hm, not sure how to respond to that yet!"
      };
      break;
  }
  
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

function handleMessage(sender_psid, received_message) {

  let response;

  const nlp = firstEntity(received_message.nlp, 'meal');

  console.log("OMG LOOK HERE for firstEntity OUTPUT",nlp)
  
  try{
    if (received_message.text === 'Get Started'){
      response = {
        "attachment": {
                "type": "template",
                "payload": {
                  "template_type": "generic",
                  "elements": [{
                    "title": "Welcome!",
                    "subtitle": "What would you like to know about?",
                    "buttons": [
                      {
                        "type": "postback",
                        "title": "Caff times",
                        "payload": "meal",
                      },
                      {
                        "type": "postback",
                        "title": "Contact info",
                        "payload": "contact",
                      },
                      {
                        "type": "postback",
                        "title": "Medical info",
                        "payload": "medical",
                      }
                    ],
                  }]
                }
              }
      }
    } else {
      switch (nlp.value){
        case 'medical': 
          response = {
            "text": `In response to"${received_message.text}". \n ${responses.medical}`
          };
          break;

        case 'meal':
          response = {
            "attachment": {
              "type": "image",
              "payload": {
                "attachment_id": 711364085956528
              }
            }
          }
          break;
        
        case 'contact':
          response = {
            "text" : responses.contact
          };
          break;

        default:
          response = {
            "text" : "Hm, not sure how to respond to that yet!"
          };
          break;
      }
    }
  } catch (e){
    console.log("ERROR LOLS",e);
    response = {
      "text" : "Hm, not sure how to respond to that yet!"
    }
  }

  
  // check greeting is here and is confident
  // if (greeting && greeting.confidence > 0.8) {
  // // } else { 
  // //     // default logic
  // // }

  // // // Check if the message contains text
  // // if (received_message.text) {    
      
  // //     let message= received_message.text;

 
  //   // Create the payload for a basic text message
  //   console.log("OMG LOOK HERE",)
  //   response = {
  //     "text": `You sent the message: "${received_message.text}". Now send me an image! - Chuen`
  //   }
  // }  
  // else if (received_message.attachments) {

  //   // Gets the URL of the message attachment
  //   let attachment_url = received_message.attachments[0].payload.url;
  //   response = {
  //     "attachment": {
  //       "type": "template",
  //       "payload": {
  //         "template_type": "generic",
  //         "elements": [{
  //           "title": "Is this the right picture?",
  //           "subtitle": "Tap a button to answer.",
  //           "image_url": attachment_url,
  //           "buttons": [
  //             {
  //               "type": "postback",
  //               "title": "Yes!",
  //               "payload": "yes",
  //             },
  //             {
  //               "type": "postback",
  //               "title": "No!",
  //               "payload": "no",
  //             }
  //           ],
  //         }]
  //       }
  //     }
  //   }
  
  // } 
  
  // Sends the response message
  callSendAPI(sender_psid, response);

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

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
          console.log('message sent!')
        } else {
          console.error("Unable to send message:" + err);
        }
    }); 
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
      
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
      
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
    
      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
        
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

curl -X POST -H "Content-Type: application/json" -d '{
  "message":{
    "attachment":{
      "type":"image", 
      "payload":{
        "url":"http://jcsuchatbot.herokuapp.com/meal.png", 
        "is_reusable":true,
      }
    }
  }
}' "https://graph.facebook.com/v2.6/me/message_attachments?access_token=***REMOVED***"


curl -X POST -H "Content-Type: application/json" -d '{
  "recipient": {
    "id": "2625552627485477"
  },
  "message": {
    "attachment": {
      "type": "image",
      "payload": {
        "attachment_id": "711364085956528"
      }
    }
  }
}' "https://graph.facebook.com/v2.6/me/messages?access_token=***REMOVED***"  


https://calm-coast-92557.herokuapp.com/  <- HEROKU URL

curl -H "Content-Type: application/json" -X POST "localhost:1337/webhook" -d '{"object": "page", "entry": [{"messaging": [{"message": "When is dinner","sender":{"id":'1'}}]}]}'
curl -H "Content-Type: application/json" -X POST "https://jcsuchatbot.herokuapp.com/webhook" -d '{"object": "page", "entry": [{"messaging": [{"message": "When is dinner","sender":{"id":'1'}}]}]}'

curl -X GET "localhost:1337/webhook?hub.verify_token=***REMOVED***&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe"
curl -X GET "https://jcsuchatbot.herokuapp.com/webhook?hub.verify_token=***REMOVED***&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe"


2625552627485477 -- your id



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