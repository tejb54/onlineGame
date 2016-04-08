module.exports = function(io){
  //var uuid = require('uuid');

  //array with the id:s to all of the players
  var players = []

  io.on('connection', function(socket){

    console.log('a user connected')
    var id = socket.id;
    console.log(id);

    //send data/info back to the newley connected player
    socket.emit('connected',id);

    //send spawn to all of the already connected players
    socket.broadcast.emit('spawn',id);

    //Add the player id to array for the server to controll
    players.push(id);

    //player disconnect remove from players
    socket.on('disconnect',function(){
      console.log("disconnect!");
    });

    socket.on('ready',function(){
      for (var i = 0; i < players.length; i++)
      {

        //dont send a spawn evet about yourself
        if(socket.id != players[i])
        {
          //send the already connected players to the new player
          socket.emit('spawn', players[i]);
        }

      }
    });

    //player moved
    socket.on('moved',function(data){
      console.log(data);
      data.id = socket.id;
      socket.broadcast.emit('moved',data);
    });
  });
}
