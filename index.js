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

app.get('/',function(req,res) {
    res.send("HI I am a chatbot")
})

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

