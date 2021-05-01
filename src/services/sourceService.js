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

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado ao mongodb')
}).catch((err) => {
    console.log('Houve algum erro: ' + err)
})

module.exports = { insertNewSource, requestAllSources }
