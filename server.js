var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = 8000;

//networking code for the game using socket.io
require('./networking.js')(io);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile('index.html');
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
