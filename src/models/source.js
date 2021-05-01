const mongoose = require('mongoose')
const Schema = mongoose.Schema
   
const Source = new Schema({
    buffer: {
        type: Buffer,
        required: true
    }
})

mongoose.model('sources', Source);