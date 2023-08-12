const line = require('@line/bot-sdk')
const express = require('express')
const axios = require('axios').default
const dotenv = require('dotenv')

const env = dotenv.config().parsed
const app = express()
const port = env.PORT

const lineConfig = {
    channelAccessToken: env.ACCESS_TOKEN,
    channelSecret: env.SECRET_TOKEN
}

const client = new line.Client(lineConfig);

app.post('/webhook', line.middleware(lineConfig),async(req,res)=>{
    try {
        const events = req.body.events;
        console.log('event1',events);
        return events.length > 0 ? await events.map(item => handleEvent(item)) : res.status(200).send('OK')
    } catch (error) {
        res.status(500).end()        
    }
});

const handleEvent = async (event) => {
    if(event.type === 'message' && event.message.type === 'text'){

    }
    return client.replyMessage(event.replyToken,{type:'text', text:'Test'})
}

app.listen(port, () => {
    console.log('listening on port ',port)
})