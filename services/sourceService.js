const mongoose = require('mongoose')
require('../models/source')
const Source = mongoose.model('sources')

async function insertNewSource(bufferImage){
    await new Source({ buffer: bufferImage }).save()
    console.log('Imagem inserida com sucesso')
}

async function requestAllSources(){
    return await Source.find()
}

mongoose.Promise = global.Promise;
        mongoose.connect('mongodb+srv://user:1234@twitter-bot-z8lst.mongodb.net/le-bot?retryWrites=true&w=majority', {
            useNewUrlParser: true 
        }).then(() => {
            console.log('Conectado ao mongodb')
        }).catch((err) => {
            console.log('Houve algum erro: ' + err)
        })

module.exports = {insertNewSource, requestAllSources}