module.exports = function(io){
  //var uuid = require('uuid');

  //array with the id:s to all of the players
  var players = [];


  function removePlayer(socket){
    //remove the player from the array
    for (var i = 0; i < players.length; i++)
    {
      //remove the player with the same id
      if(socket.id == players[i])
      {
        //remove at position i in the array
        players.splice(i, 1);

        //send the info to all the other players that a player has disconnected
        socket.broadcast.emit('remove player',socket.id);
        break;
      }
    }
  }

  io.on('connection', function(socket){

    console.log('a user connected')
    var id = socket.id;
    console.log(id);

    //send data/info back to the newly connected player
    socket.emit('connected',id);

    //send spawn to all of the already connected players
    socket.broadcast.emit('spawn',id);

    //Add the player id to array for the server to control
    players.push(id);

    //player disconnect remove from players
    socket.on('disconnect',function(){
      console.log("disconnect from " + socket.id);
      removePlayer(socket);
    });

    socket.on('ready',function(){
      for (var i = 0; i < players.length; i++)
      {

        //don't send a spawn event about yourself
        if(socket.id != players[i])
        {
          //send the already connected players to the new player
          socket.emit('spawn', players[i]);
        }
      }
    });

    socket.on('shoot',function(data){
      //console.log(data);
      socket.broadcast.emit('shoot',data);
    });

    //player moved
    socket.on('moved',function(data){
      //console.log(data);
      data.id = socket.id;
      socket.broadcast.emit('moved',data);
    });

    socket.on('killed',function (){
      //player killed by other player
      console.log(socket.id + ' killed');
      removePlayer(socket);
    });
  });
};
