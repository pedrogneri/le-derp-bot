const express = require('express')
const mongoose = require('mongoose')
require('../models/source')
const Source = mongoose.model('sources')

const app = express()

async function insertNewSource(bufferImage){
    await new Source({ buffer: bufferImage }).save()
    console.log('Imagem inserida com sucesso')
}

async function requestAllSources(){
    return await Source.find()
}

mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://localhost/twitter-bot', {
            useNewUrlParser: true 
        }).then(() => {
            console.log('Conectado ao mongodb')
        }).catch((err) => {
            console.log('Houve algum erro: ' + err)
        })

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log('Servidor rodando...')
})

module.exports = {insertNewSource, requestAllSources}