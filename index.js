const Twit = require('twit')
const credentials = require('./credentials/twit')
const readLine = require('readline-sync')
const sharp = require('sharp')
const fs = require('fs')

var T = new Twit(credentials)

makeMediaTweet('output-test.jpg')

function readStatusAndReturn() {
    return readLine.question('O que deseja twittar?')
}

function makeTextTweet(){
    const tweet = readStatusAndReturn();
    T.post('statuses/update', { status: tweet }, function(err, data, response) {
        console.log(data)
    })
}

function makeMediaTweet(path){
    var b64content = fs.readFileSync('./images/' + path, { encoding: 'base64' })
 
    T.post('media/upload', { media_data: b64content }, function (err, data, response) {
      var mediaIdStr = data.media_id_string
      var altText = "Teste #1"
      var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
     
      T.post('media/metadata/create', meta_params, function (err, data, response) {
        if (!err) {
          // now we can reference the media and post a tweet (media will attach to the tweet)
          var params = { status: 'Teste #1', media_ids: [mediaIdStr] }
     
          T.post('statuses/update', params, function (err, data, response) {
            console.log(data)
          })
        }
      })
    })
}

function resizeImage(){
    sharp('./images/selo_sam.png')
    .resize(75, 75)
    .toFile('./images/_selo.png', function(err) {
        console.log(err)
  })
}

function compositeTirinhaMeme(){
    sharp('./images/template.png')
    .flatten( { background: '#ff6600' } )
    .composite(
      [
          { input: './images/_meme1.png', gravity: 'west' }, 
          { input: './images/_meme2.png', gravity: 'center' },
          { input: './images/_meme3.png', gravity: 'east' },
          { input: './images/_selo.png', gravity: 'southeast' }
      ])
    .sharpen()
    .withMetadata()
    .png( { quality: 90 } )
    .toBuffer()
    .then(function(outputBuffer) {
          sharp(outputBuffer).toFile('./images/output-test.jpg', (err) => {})
  }).catch((err) => {
      console.log('erro: ' + err)
  })
}
