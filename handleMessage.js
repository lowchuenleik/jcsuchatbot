
function firstEntity(nlp, name) {
    return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
}
  
module.exports = {
// Handles messages events so this is where the FAQ goes.
    handleMessage: function(sender_psid, received_message) {

        let response;
    
        const greeting = firstEntity(message.nlp, 'meal');
      
        console.log("OMG LOOK HERE for GREETING",)
        response = {
        "text": `You sent the message: "${received_message.text}". Now send me an image! - Chuen`
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
    },

    
    // Sends response messages via the Send API
    callSendAPI: function(sender_psid, response) {
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
}