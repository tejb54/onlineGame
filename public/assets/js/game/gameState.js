var gameState = {
  players: [],

  preload: function(){
    game.load.image('player',"/assets/images/snake.png");
    game.load.image('bullet',"/assets/images/bullet.png");
  },

  create: function(){
    this.player = game.add.sprite(10,10,'player');
    this.player.anchor.setTo(0.5,0.5);
    this.player.scale.setTo(2,2);
    game.physics.enable(this.player, Phaser.Physics.ARCADE);


    this.bullets = game.add.group();
    this.onlineBullets = game.add.group();

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

    if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
    {
      if(this.bullets.children.length <= 4)
      {
        this.addBullet();
      }

    }

    if(moved)
    {
      //send players position
      socket.emit('moved',{
        x: this.player.x,
        y: this.player.y,
        angle: this.player.angle});
    }

    //collision between onlineBullets and player
    game.physics.arcade.overlap(this.player,this.onlineBullets,function(item1,item2){
      console.log('player with id: ' + gameState.id + ' is dead');
      item2.body = null;
      item2.destroy();
    },null,this);


    //This is not working
    //This will remove your bullets when they hit an enemy
    game.physics.arcade.overlap(this.players,this.bullets,function(item1,item2){
      item2.body = null;
      item2.destroy();
    },null,this);



    //this is temprary should be fixed with outOfBoundsKill = true
    //this willl remove any of the bullets that are outside of the world
    this.bullets.forEach(function(item){
      if(item.body.x < 0 || item.body.x > game.world.width || item.body.y < 0 || item.body.y > game.world.height)
      {
        //console.log('destroy');
        item.body = null;
        item.destroy();
      }
    });


    this.onlineBullets.forEach(function(item){
      if(item.body.x < 0 || item.body.x > game.world.width || item.body.y < 0 || item.body.y > game.world.height)
      {
        console.log('destroy');
        item.body = null;
        item.destroy();
      }
    });
  },

  addBullet: function()
  {
    var bullet = game.add.sprite(this.player.x,this.player.y,'bullet');
    game.physics.enable(bullet, Phaser.Physics.ARCADE);
    game.physics.arcade.velocityFromAngle(this.player.angle, 500, bullet.body.velocity);
    bullet.angle = this.player.angle;
    this.bullets.add(bullet);
    socket.emit('shoot',
    {
      x: bullet.body.x,
      y: bullet.body.y,
      angle: bullet.angle
    }
    );
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
  tmpSprite.anchor.setTo(0.5,0.5);
  tmpSprite.scale.setTo(2.0,2.0);
  //game.physics.enable(tmpSprite, Phaser.Physics.ARCADE);
  tmpSprite.id = data;

  gameState.players.push(tmpSprite);
});

socket.on('moved',function(data){
  //console.log(data);

  for(var i = 0; i < gameState.players.length; i++)
  {
    //find player with the right id
    if(gameState.players[i].id == data.id)
    {
      gameState.players[i].x = data.x;
      gameState.players[i].y = data.y;
      gameState.players[i].angle = data.angle;
      break;
    }
  }
});


//spawn bullets from other players
socket.on('shoot',function(data){
  var bullet = game.add.sprite(data.x,data.y,'bullet');
  game.physics.enable(bullet, Phaser.Physics.ARCADE);
  game.physics.arcade.velocityFromAngle(data.angle, 500, bullet.body.velocity);
  bullet.angle = data.angle;
  gameState.onlineBullets.add(bullet);
});

socket.on('remove player',function(id){
  for (var i = 0; i < gameState.players.length; i++) {

    //remove player from array with the right id
    if(id == gameState.players[i].id)
    {
      gameState.players[i].destroy();
      gameState.players.splice(i,1);
      break;
    }
  }
});
