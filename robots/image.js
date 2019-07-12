const mongoose = require('mongoose')
require('../models/source')
const Source = mongoose.model('sources')
const sharp = require('sharp')
const templates = require('../data/templates.json')

async function resizeImage(fileName){
    return await sharp('images/' + fileName).resize(400, 300).toBuffer()
}

async function compositeImage(){
    const templateConfigs = templates[generateRandomInteger(0, 3)]
    const templateImage = await generateTemplateImage(templateConfigs)
    await requestSourceImages(templateConfigs)

    const outputBuffer = await sharp(templateImage)
        .composite(templateConfigs.composite)
        .sharpen()
        .withMetadata()
        .png( { quality: 90 } )
        .toBuffer()

    sharp(outputBuffer).toFile('images/output.jpg', (err) => {
        console.log(!err ? 'Buffer convertido para arquivo com sucesso' : 'Erro ao converter buffer para arquivo: ' + err) 
    })
    await sleep(200)
}

async function requestSourceImages(templateConfigs){
    const sourceImages = await Source.aggregate([ { $sample: { size: templateConfigs.composite.length } } ])
    for(var x = 0; x < templateConfigs.composite.length; x++)
        templateConfigs.composite[x].input = sourceImages[x].buffer.buffer
}

async function generateTemplateImage(templateConfigs){
    return await sharp({
        create: {
          width: templateConfigs.width,
          height: templateConfigs.height,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 1 }
        }
    }).png().toBuffer()
}

function generateRandomInteger(min, max){
    return Math.floor(Math.random() * (max - min) + min)
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

module.exports = {compositeImage, resizeImage}