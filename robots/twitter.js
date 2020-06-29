const Twit = require('twit')
const readLine = require('readline-sync')
const fs = require('fs')
require('dotenv').config()

const T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
})

function makeMediaTweet(){
    const b64Image = fs.readFileSync('output/output.jpg', { encoding: 'base64' })
    const date = new Date()

    T.post('media/upload', { media_data: b64Image }, (err, data, response) => {
      var mediaIdStr = data.media_id_string
      var altText = "Imagem gerada automaticamente"
      var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

      T.post('media/metadata/create', meta_params, (err, data, response) => {
        if (!err) {
          var params = { status: "", media_ids: [mediaIdStr] }
     
          T.post('statuses/update', params, (err, data, response) => {
            if(!err) console.log('Tweet feito com sucesso!')
            else console.log('Erro ao postar o tweet: ' + err)
            console.log("Tweet feito em: " + date.getHours() + ':' + date.getMinutes())
          })
        } else 
            console.log('Erro ao upar mídia para o twitter: ' + err)
      })
    })
}

module.exports = {makeMediaTweet}