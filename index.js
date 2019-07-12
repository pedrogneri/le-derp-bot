const twitterBot = require('./robots/twitter.js')
const imageBot = require('./robots/image.js')
const uploader = require('./uploader/uploader')
const readline = require('readline-sync')
const fs = require('fs')

async function start(){
  const options = [ 'Make a tweet', 'Upload source images']
  const selectedOption = await readline.keyInSelect(options, 'Choose one option: ') + 1

  if(selectedOption == 1) await tweetImage()
  else if(selectedOption == 2) await uploadSources()
  else process.exit(0)
}

async function tweetImage(){
  await imageBot.compositeImage()
  await twitterBot.makeMediaTweet()
}

async function uploadSources(){
  const fileNames = await getImageFileNames()
  for(var x=0; x < fileNames.length; x++){
    const resizedImageBuffer = await imageBot.resizeImage(fileNames[x])
    await uploader(resizedImageBuffer)
    deleteImage(fileNames[x])
  }
}

function deleteImage(fileName){
  fs.unlink('./images/' + fileName, (err) => {
    console.log(!err ? 'Imagem excluida com sucesso!' : 'Erro ao excluir imagem: ' + err)
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

start()