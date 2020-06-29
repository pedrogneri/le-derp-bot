const twitterBot = require('./robots/twitter.js')
const imageBot = require('./robots/image.js')
const sourceService = require('./services/sourceService')
const mkdirp = require('mkdirp')
const fs = require('fs')

var express = require('express');
var app = express();

app.get('/tweet', (req, res) => {
  tweetImage().then(() => {
    res.status(200).send({ message: 'tweet postado com sucesso!' })
  }).catch((err) => {
    res.status(500).send({ error: err });
  })
});

app.get('/autoTweet', (req, res) => {
  autoTweet();
  res.status(200).send({ message: 'auto tweet turned on' })
});

async function tweetImage(){
  await imageBot.compositeImage()
  twitterBot.makeMediaTweet()
}

function autoTweet(){
  const tweetInterval = 120 * 6000
  const date = new Date()
  console.log('Iniciado em: ' + date.getHours() + ':' + date.getMinutes())
  setInterval(() => {tweetImage()}, tweetInterval)
}

async function insertSources(){
  const fileNames = await getImageFileNames()
  for(var x=0; x < fileNames.length; x++){
    const resizedImageBuffer = await imageBot.resizeImage(fileNames[x])
    await sourceService.insertNewSource(resizedImageBuffer)
    deleteImage(fileNames[x])
  }
}

function deleteImage(fileName){
  fs.unlink('./output/' + fileName, (err) => {
    if(!err) console.log('Imagem excluida com sucesso!')
    else console.log('Erro ao excluir imagem: ' + err)
  })
}

function readdir(path){
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, paths) =>{
    if(err)
      reject(err)
    else
      resolve(paths)
    })
  })
}

async function getImageFileNames(){
  const imageFiles = await readdir('./images')
  imageFiles.splice(imageFiles.indexOf('output.jpg'))

  for(var x = 0; x < imageFiles.length; x++)
    if(extension(imageFiles[x]) !== 'png')
      imageFiles.splice(x, 1)

  return imageFiles
}

async function downloadSources(){
  const sources = await sourceService.requestAllSources()
  createPath('output/sourcesBackup')
  sources.forEach(source => {
    imageBot.convertBufferToFile(source.buffer, 'sourcesBackup/' + source._id + '.png')
  })
}

function createPath(pathName){
  mkdirp('./' + pathName, function (err) {
    if (err) console.error(err)
    else console.log('Pasta ' + pathName + ' criada com sucesso')
  })
}

function extension(fileName) {
  const path = './output/' + fileName
  var idx = (~-path.lastIndexOf(".") >>> 0) + 2;
  return path.substr((path.lastIndexOf("/") - idx > -3 ? -1 >>> 0 : idx));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT);
