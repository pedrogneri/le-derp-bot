const mongoose = require('mongoose')
require('../models/source')
const Source = mongoose.model('sources')
const sharp = require('sharp')

async function resizeImage(fileName){
    return await sharp('output/' + fileName).resize(400, 300).toBuffer()
}

async function compositeImage(){
    const templateConfigs = generateTemplateConfigs(generateRandomInteger(1, 4), generateRandomInteger(1, 4))
    const templateImage = await generateTemplateImage(templateConfigs)
    await requestSourceImages(templateConfigs)
 
    const outputBuffer = await sharp(templateImage)
        .composite(templateConfigs.composite)
        .sharpen()
        .withMetadata()
        .png( { quality: 100 } )
        .toBuffer()

    convertBufferToFile(outputBuffer ,'output.jpg')
    await sleep(3000)
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

async function convertBufferToFile(buffer, fileName){
    await sharp(buffer).toFile('output/' + fileName, (err) => {
        if(!err) console.log('Buffer convertido para arquivo com sucesso')
        else console.log('Erro ao converter buffer para arquivo: ' + err)
    })
}

function generateTemplateConfigs(xCells, yCells){
    const template = {
        width: calculateImageConfigs(xCells, 400),
        height: calculateImageConfigs(yCells, 300),
        composite: []
    }

    for(var x=0; x < xCells; x++){
        const leftCooordinate = calculateImageConfigs(x, 400)
        for(var y=0; y < yCells; y++){
            const topCoordinate = calculateImageConfigs(y, 300)
            template.composite.push({ input: null, top: topCoordinate, left: leftCooordinate })
        }
    }
    return template
}

function calculateImageConfigs(cell, size){
    return (cell * size) + (5 + cell * 5)
}

function generateRandomInteger(min, max){
    return Math.floor(Math.random() * (max - min) + min)
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

module.exports = {compositeImage, resizeImage, convertBufferToFile}