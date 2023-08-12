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
        console.log('event',events);
        return events.length > 0 ? await events.map(item => handleEvent(item)) : res.status(200).send('OK')
    } catch (error) {
        res.status(500).end()        
    }
});

const handleEvent = async (event) => {
    if(event.type === 'message' && event.message.type === 'text'){

        const textInput = event.message.text
        let textLot = textInput.trim().split(' ');
        console.log('textLot',textLot)
        textLot = [textLot[0]]
        // const allReply = textLot.map(async text => {
        textLot.forEach(async text => {
            try {
                const {data} = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${text}`)

                let replyMessage = ''
                
                const word = data[0].word
                const word2 = word.charAt(0).toUpperCase() + word.slice(1);
        
                replyMessage += word2 + '\n' + '\n'
                
                data[0].meanings.forEach(meaning => {
        
                    const partOfSpeech = meaning.partOfSpeech
                    const definitions = meaning.definitions
                    const definition = definitions[0].definition
                    
                    // definitions.forEach(definition => {
                    //     // console.log('- ',definition.definition)
                    // });
        
                    const pos = partOfSpeech.charAt(0).toUpperCase() + partOfSpeech.slice(1);
                    const def = definition.charAt(0).toUpperCase() + definition.slice(1);
        
                    replyMessage += pos + ': ' + def + '\n'
                });
                // return replyMessage
                return client.replyMessage(event.replyToken, {type:'text', text:replyMessage});
                // await client.replyMessage(event.replyToken, {type:'text', text:replyMessage});
                
            } catch (error) {
                console.error('Error',error)
                return
            }
        });

        // Promise.all(allReply)
        // .then(replyMessages => {
        //     replyMessages.forEach(async replyMessage => {
        //         try {
        //             // await client.replyMessage(event.replyToken, {type:'text', text:replyMessage}); //WHY??
        //             setTimeout(() => {
        //                 console.error('----- replyMessage -----', replyMessage);
        //                 return client.replyMessage(event.replyToken, {type:'text', text:replyMessage});
        //             }, replyMessages.length * 1000)

        //         } catch (error) {
        //             console.error('Error', error);
        //         }
        //     });
        // })
        // .catch(error => {
        //     console.error('Error in Promise.all', error);
        // });
            
    }
    
}

app.listen(port, () => {
    console.log('listening on port ',port)
})