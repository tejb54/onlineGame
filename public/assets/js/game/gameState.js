var gameState = {

  preload: function(){
    game.load.image('player',"/assets/images/spaceship.png");
    game.load.image('bullet',"/assets/images/rocket.png");
    game.load.image('health',"/assets/images/health.png")
  },

  create: function(){
    this.player = game.add.sprite(10,10,'player');
    this.player.anchor.setTo(0.5,0.5);
    this.player.scale.setTo(0.6,0.6);

    this.player.shootEnabled = true;

    //adding a healtbar for the player
    this.healthBar = game.add.sprite(-10 + this.player.x ,-20 + this.player.y,'health');
    //this.healthBar.anchor.setTo(0.5,0.5);
    this.healthBar.scale.x = 15;


    game.physics.enable(this.player, Phaser.Physics.ARCADE);

    //group with your bullets
    this.bullets = game.add.group();

    //group with bullets from other players
    this.onlineBullets = game.add.group();

    //group of other players
    this.players = game.add.group();
    //needed for collision
    this.players.enableBody = true;
    this.players.physicsBodyType = Phaser.Physics.ARCADE;


    this.player.body.collideWorldBounds=true;

    //tell the server that you are ready to get data
    socket.emit('ready');
  },

  update: function(){

    this.healthBar.x = this.player.x - 20;
    this.healthBar.y = this.player.y - 30;

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

    if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
      if(this.player.shootEnabled)
      {
        this.player.shootEnabled = false;

        //makes the player shot three rockets/bullets
        this.addBullet(this.player.angle);
        this.addBullet(this.player.angle - 10);
        this.addBullet(this.player.angle + 10);

        //this.addBullet(this.player.angle - 20);
        //this.addBullet(this.player.angle + 20);

        setTimeout(function(){
          gameState.player.shootEnabled = true;
        },600);
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
      if(this.healthBar.scale.x > 0)
      {
        this.healthBar.scale.x--;
      }
      else
      {
        //tell the server that you have been killed
        socket.emit('killed');
        game.state.start('gameOverState');
      }

    },null,this);


    //This is not working
    //This will remove your bullets when they hit an enemy
    game.physics.arcade.overlap(this.players,this.bullets,function(item1,item2){
      item2.body = null;
      item2.destroy();
    },null,this);



    //this is temporary should be fixed with outOfBoundsKill = true
    //this will remove any of the bullets that are outside of the world
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

  addBullet: function(angle)
  {

    var bullet = game.add.sprite(this.player.x,this.player.y,'bullet');
    bullet.scale.setTo(0.15,0.15);
    game.physics.enable(bullet, Phaser.Physics.ARCADE);
    game.physics.arcade.velocityFromAngle(angle, 500, bullet.body.velocity);
    bullet.angle = angle;
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

socket.on('connected' ,function(id){
  gameState.id = id;
  console.log(id);
});

socket.on('spawn' , function(data){
  console.log('other player joined with id: ' + data);

  var tmpSprite = game.add.sprite(20,20,'player');
  tmpSprite.anchor.setTo(0.5,0.5);
  tmpSprite.scale.setTo(0.6,0.6);
  //game.physics.enable(tmpSprite, Phaser.Physics.ARCADE);
  tmpSprite.id = data;

  gameState.players.add(tmpSprite);
});

socket.on('moved',function(data){
  //console.log(data);

  for(var i = 0; i < gameState.players.children.length; i++)
  {
    //cache the item in the array
    var item = gameState.players.children[i];

    //find player with the right id
    if(item.id == data.id)
    {
      item.x = data.x;
      item.y = data.y;
      item.angle = data.angle;
      break;
    }
  }
});

//spawn bullets from other players
socket.on('shoot',function(data){
  var bullet = game.add.sprite(data.x,data.y,'bullet');
  bullet.scale.setTo(0.2,0.2);
  game.physics.enable(bullet, Phaser.Physics.ARCADE);
  game.physics.arcade.velocityFromAngle(data.angle, 500, bullet.body.velocity);
  bullet.angle = data.angle;
  gameState.onlineBullets.add(bullet);
});

socket.on('remove player',function(id){
  for (var i = 0; i < gameState.players.children.length; i++) {

    var item = gameState.players.children[i];

    //remove player from array with the right id
    if(id == item.id)
    {
      item.destroy();
      break;
    }
  }
});
