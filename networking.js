module.exports = function(io){
  //var uuid = require('uuid');
  var players = []

  io.on('connection', function(socket){

    console.log('a user connected')
    var id = socket.id;
    console.log(id);

    //send data/info back to the newley connected player
    socket.emit('connected',id);

    //send spawn to all of the already connected players
    socket.broadcast.emit('spawn',id);

    for (var i = 0; i < players.length; i++)
    {
      //send the already connected players to the new player
      socket.emit('spawn', players[i]);
    }

    //Add the player id to array for the server to controll
    players.push(id);

    //player disconnect remove from players
    socket.on('disconnect',function(){
      console.log("disconnect!");
    });

    //player moved
    socket.on('moved',function(data){
      console.log(data);
      data.id = socket.id;
      socket.broadcast.emit('moved',data);
    });
  });
}
