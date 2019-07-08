const Twit = require('twit')
const credentials = require('./credentials/twit')

var T = new Twit(credentials)
  
T.post('statuses/update', { status: 'alo' }, function(err, data, response) {
    console.log(data)
})