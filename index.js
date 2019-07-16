const twitterBot = require('./robots/twitter.js')
const imageBot = require('./robots/image.js')
const sourceService = require('./services/sourceService')
const readline = require('readline-sync')
const fs = require('fs')

start()
// TODO: fix upload jpg error
async function start(){
  const options = [ 'Turn on auto tweet', 'Make a tweet', 'Upload source images', 'Download sources' ]
  const selectedOption = process.argv[2] != null ? process.argv[2] : await readline.keyInSelect(options, 'Choose one option: ') + 1

  if(selectedOption == 1) await autoTweet()
  else if(selectedOption == 2) await tweetImage()
  else if(selectedOption == 3) await insertSources()
  else if(selectedOption == 4) await downloadSources()
  else process.exit(0)
}

async function tweetImage(){
  await imageBot.compositeImage()
  await twitterBot.makeMediaTweet()
}

async function autoTweet(){
  const tweetInterval = 120 * 60000
  const date = new Date()
  console.log('Iniciado em: ' + date.getHours() + ':' + date.getMinutes())
  await setInterval(() => {tweetImage()}, tweetInterval)
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
  sources.forEach(source => {
    imageBot.convertBufferToFile(source.buffer, source._id + '.png')
  })
}

function extension(fileName) {
  const path = './images/' + fileName
  var idx = (~-path.lastIndexOf(".") >>> 0) + 2;
  return path.substr((path.lastIndexOf("/") - idx > -3 ? -1 >>> 0 : idx));
}