const Twit = require('twit')
const credentials = require('../credentials/twit')
const readLine = require('readline-sync')
const fs = require('fs')

const T = new Twit(credentials)

function robot(){
    const text = readStatusAndReturn()
    const b64Image = fs.readFileSync('images/output-test.jpg', { encoding: 'base64' })
    makeMediaTweet(text, b64Image)
}

function readStatusAndReturn() {
    return readLine.question('O que deseja twittar?')
}

function makeMediaTweet(text, compositeImage){
    T.post('media/upload', { media_data: compositeImage }, function (err, data, response) {
      var mediaIdStr = data.media_id_string
      var altText = "Imagem gerada automaticamente"
      var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
     
      T.post('media/metadata/create', meta_params, function (err, data, response) {
        if (!err) {
          var params = { status: text, media_ids: [mediaIdStr] }
     
          T.post('statuses/update', params, function (err, data, response) {
            console.log(!err ? 'Tweet feito com sucesso!' : 'Erro ao postar o tweet: ' + err)
          })
        } else 
            console.log('erro ao upar mídia para o twitter: ' + err)
      })
    })
}

module.exports = robot