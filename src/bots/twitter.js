const Twit = require('twit')
require('dotenv').config()

const twit = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
})

function makeMediaTweet(buffer){
    const b64Image = buffer.toString('base64');
    const date = new Date()

    twit.post('media/upload', { media_data: b64Image }, (err, data, response) => {
      const mediaIdStr = data.media_id_string
      const altText = "Imagem gerada automaticamente"
      const meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

      twit.post('media/metadata/create', meta_params, (err, data, response) => {
        if (!err) {
          const params = { status: "", media_ids: [mediaIdStr] }
     
          twit.post('statuses/update', params, (err, data, response) => {
            if(!err) {
              console.log('Tweet feito com sucesso!')
              console.log("Tweet feito em: " + date.getHours() + ':' + date.getMinutes())
            }
            else console.log('Erro ao postar o tweet: ' + err)
          })
        } else {
          console.log('Erro ao upar mídia para o twitter: ' + err)
        }
      })
    })
}

module.exports = { makeMediaTweet }
