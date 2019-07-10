const sharp = require('sharp')
const fs = require('fs')

function robot(){
    const memesNumber = [generateRandomImageNumber(), generateRandomImageNumber(), generateRandomImageNumber()]
    compositeTirinhaMeme(memesNumber)
}

function resizeImage(number){
    sharp('../images/meme' + number +'.png')
    .resize(400, 300)
    .toFile('../images/_meme' + number + '.png', function(err) {
        console.log(err)
  })
}

function compositeTirinhaMeme(memesNumber){
    sharp('images/template.png')
    .flatten( { background: '#ff6600' } )
    .composite(
      [
          { input: 'images/_meme' + memesNumber[0] + '.png', gravity: 'west' }, 
          { input: 'images/_meme' + memesNumber[1] + '.png', gravity: 'center' },
          { input: 'images/_meme' + memesNumber[2] + '.png', gravity: 'east' },
          { input: 'images/_selo.png', gravity: 'southeast' }
      ])
    .sharpen()
    .withMetadata()
    .png( { quality: 90 } )
    .toBuffer()
    .then((outputBuffer) => {
      sharp(outputBuffer).toFile('images/output-test.jpg', (err) => {})
  }).catch((err) => {
      console.log('erro: ' + err)
  })
}

function generateRandomImageNumber(){
    return Math.floor(Math.random() * (10) + 1)
}

module.exports = robot