const robots = {twitter: require('./robots/twitter.js'), image: require('./robots/image.js')}
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function start(){
  robots.image()
  sleep(2000).then(() => {
    robots.twitter()
  })
}

start()