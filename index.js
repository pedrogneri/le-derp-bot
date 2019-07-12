const robots = {twitter: require('./robots/twitter.js'), image: require('./robots/image.js')}
const uploader = require('./uploader/uploader')
const fs = require('fs')
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function start(){
  robots.image()
  // sleep(2000).then(() => {
  //   robots.twitter()
  // })
  // for(var x = 1; x <= 10; x++)
  //   uploader(await fs.readFileSync('./images/_meme' + x + '.png'))
  // console.log(await getImageFileNames())
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
  for(var x=0; x < imageFiles.length; x++)
    if(imageFiles[x].split('.').pop() != 'png')
      imageFiles.splice(x, 1)

  return imageFiles
}

start()