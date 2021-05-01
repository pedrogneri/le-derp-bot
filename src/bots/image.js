const mongoose = require('mongoose')
require('../models/source')

const Source = mongoose.model('sources')
const sharp = require('sharp')

const CELL_WIDTH = 400;
const CELL_HEIGHT = 300;

async function resizeImage(fileName){
    return await sharp('output/' + fileName).resize(CELL_WIDTH, CELL_HEIGHT).toBuffer()
}

async function compositeImage(){
    const xSize = generateRandomInteger(1, 4)
    const ySize = generateRandomInteger(1, 4)
    const templateConfigs = generateTemplateConfigs(xSize, ySize)
    const templateImage = await generateTemplateImage(templateConfigs)
    await requestSourceImages(templateConfigs)

    console.log('Gerando imagem...')
    const imageBuffer = await sharp(templateImage)
            .composite(templateConfigs.composite)
            .sharpen()
            .withMetadata()
            .png({ quality: 100 })
            .toBuffer()

    console.log('Imagem gerada com sucesso')
    return imageBuffer
}

async function requestSourceImages(templateConfigs){
    console.log('Procurando sources...')
    const sourceImages = await Source.aggregate([ { $sample: { size: templateConfigs.composite.length } } ])
    for(let x = 0; x < templateConfigs.composite.length; x++)
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

function convertBufferToFile(buffer, fileName){
    sharp(buffer).toFile('output/' + fileName, (err) => {
        if(!err) console.log('Buffer convertido para arquivo com sucesso')
        else console.log('Erro ao converter buffer para arquivo: ' + err)
    })
}

function generateTemplateConfigs(xCells, yCells){
    const template = {
        width: calculateImageConfigs(xCells, CELL_WIDTH),
        height: calculateImageConfigs(yCells, CELL_HEIGHT),
        composite: []
    }

    for(let x=0; x < xCells; x++){
        const leftCoordinate = calculateImageConfigs(x, CELL_WIDTH)
        for(let y=0; y < yCells; y++){
            const topCoordinate = calculateImageConfigs(y, CELL_HEIGHT)
            template.composite.push({ input: null, top: topCoordinate, left: leftCoordinate })
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

module.exports = { compositeImage, resizeImage, convertBufferToFile }
