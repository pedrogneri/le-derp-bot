const Twit = require('twit')
const credentials = require('./credentials/twit')
const readLine = require('readline-sync')
const sharp = require('sharp')

var T = new Twit(credentials)
  
// var tweet = readLine.question('O que deseja twittar?')
// T.post('statuses/update', { status: tweet }, function(err, data, response) {
//     console.log(data)
// })

// sharp('./images/selo_sam.png')
//   .resize(50, 50,  {
//         background: {
//             r: 237,
//             g: 237,
//             b: 237,
//             alpha: 0
//     }})
//   .toFile('./images/_selo.png', function(err) {
//       console.log(err)
// });

sharp('./images/template.png')
  .flatten( { background: '#ff6600' } )
  .composite(
    [
        { input: './images/_meme1.png', gravity: 'west' }, 
        { input: './images/_meme2.png', gravity: 'center' },
        { input: './images/_meme3.png', gravity: 'east' },
        { input: './images/_selo.png', top: 24, left: 30 }
    ])
  .sharpen()
  .withMetadata()
  .png( { quality: 90 } )
  .toBuffer()
  .then(function(outputBuffer) {
        sharp(outputBuffer).toFile('./images/output-test.jpg', (err) => {})
}).catch((err) => {
    console.log('erro: ' + err)
});