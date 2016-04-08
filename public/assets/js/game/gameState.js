var gameState = {
  id: '0',
  players: [],

  preload: function(){
    game.load.image('player',"/assets/images/snake.png");
  },

  create: function(){
    this.player = game.add.sprite(10,10,'player');
    this.player.anchor.setTo(0.5,0.5);
    this.player.scale.setTo(2,2);
    game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.body.collideWorldBounds=true;

    //tell the server that you are ready to get data
    socket.emit('ready');
  },

  update: function(){
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;
    this.player.body.angularVelocity = 0;
    var moved = false;

    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
      this.player.body.angularVelocity = -200;
      moved = true;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
      this.player.body.angularVelocity = 200;
      moved = true;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
    {
      moved = true;
      game.physics.arcade.velocityFromAngle(this.player.angle, 300, this.player.body.velocity);
    }

    if(moved)
    {
      //send players position
      socket.emit('moved',{x:this.player.body.x,y:this.player.body.y, angle:this.player.body.angle});
    }
  }
};

//networking
//TODO make a isReady event to secure that the client is ready to add other players


socket.on('connected' ,function(id){
  gameState.id = id;
  console.log(id);
});

socket.on('spawn' , function(data){
  console.log('other player joined with id: ' + data);

  var tmpSprite = game.add.sprite(20,20,'player');
  tmpSprite.scale.setTo(2.0,2.0);
  //game.physics.enable(tmpSprite, Phaser.Physics.ARCADE);
  tmpSprite.id = data;

  gameState.players.push(tmpSprite);
});

socket.on('moved',function(data){
  console.log(data);
  //TODO neeed to send the id of the player that moved and then update that players position

  for(var i = 0; i < gameState.players.length; i++)
  {
    //find player with the right id
    if(gameState.players[i].id == data.id)
    {
      gameState.players[i].x = data.x;
      gameState.players[i].y = data.y;
      break;
    }
  }
  // gameState.players[0].x = data.x;
  // gameState.players[0].y = data.y;
  // gameState.players[0].angle = data.angle;
  //game.debug.text( "this is another player", data.x, data.y );
});
