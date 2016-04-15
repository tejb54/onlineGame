var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = 9058;

//application parameters to set the port
process.argv.forEach(function (val,index) {
  if (index === 2) {
    var result = val.split('=');
    if(result.length === 2 && result[0] === 'port')
    {
      port = parseInt(result[1]);
    }
  }
});


//networking code for the game using socket.io
//using the namespace of /game
require('./networking.js')(io.of('/game'));
require('./networkingChat.js')(io.of('/chat'));

//api
require('./api/rest.js')(app);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile('index.html');
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
