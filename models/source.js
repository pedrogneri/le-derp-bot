const mongoose = require('mongoose')
const random = require('mongoose-random')
const Schema = mongoose.Schema
   
const Source = new Schema({
    buffer: {
        type: Buffer,
        required: true
    }
})

mongoose.model('sources', Source);