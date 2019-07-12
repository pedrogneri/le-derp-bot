const twitterBot = require('./robots/twitter.js')
const imageBot = require('./robots/image.js')
const sourceService = require('./services/sourceService')
const readline = require('readline-sync')
const fs = require('fs')

start()

async function start(){
  const options = [ 'Make a tweet', 'Upload source images', 'Download sources']
  const selectedOption = await readline.keyInSelect(options, 'Choose one option: ') + 1

  if(selectedOption == 1) await tweetImage()
  else if(selectedOption == 2) await insertSources()
  else if(selectedOption == 3) await downloadSources()
  else process.exit(0)
}

async function tweetImage(){
  await imageBot.compositeImage()
  await twitterBot.makeMediaTweet()
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
  fs.unlink('./images/' + fileName, (err) => {
    if(!err) console.log('\x1b[32m', 'Imagem excluida com sucesso!')
    else console.log('\x1b[31m', 'Erro ao excluir imagem: ' + err)
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
  const imageFiles = await readdir('./images/')
  for(var x=0; x < imageFiles.length; x++){
    if(imageFiles[x].split('.').pop() != 'png')
    imageFiles.splice(x, 1)
  }
  return imageFiles
}

async function downloadSources(){
    const sources = await sourceService.requestAllSources()
    for(var x=0; x < sources.length; x++)
      imageBot.convertBufferToFile(sources[x].buffer, 'source-' + x + '.png')
}