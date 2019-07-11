const sharp = require('sharp')
const templates = require('../data/templates.json')
const fs = require('fs')

function robot(){
    compositeTirinhaMeme()
}

function resizeImage(number){
    sharp('../images/meme' + number +'.png')
    .resize(400, 300)
    .toFile('../images/_meme' + number + '.png', function(err) {
        console.log(err)
  })
}

async function compositeTirinhaMeme(){
    const template = templates[generateRandomImageNumber(0, 2)]
    const templateImage = await sharp({
        create: {
          width: template.width,
          height: template.height,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 1 }
        }
    }).png().toBuffer()

    for(var x = 0; x < template.composite.length; x++)
        template.composite[x].input = 'images/_meme' + generateRandomImageNumber(1, 11) + '.png'

    sharp(templateImage)
    .composite(template.composite)
    .sharpen()
    .withMetadata()
    .png( { quality: 90 } )
    .toBuffer()
    .then((outputBuffer) => {
        sharp(outputBuffer).toFile('images/output-test.jpg', (err) => {
        if(!err)
            console.log('Buffer convertido para arquivo com sucesso')
        else 
            console.log('Erro ao converter buffer para arquivo: ' + err)
        })
    }).catch((err) => {
        console.log('Erro ao gerar tirinha: ' + err)
    })
}

function generateRandomImageNumber(min, max){
    return Math.floor(Math.random() * (max - min) + min)
}

module.exports = robot