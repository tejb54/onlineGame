/**
 * Created by Tobias on 2016-04-11.
 */
var gameOverState = {

    preload: function (){
        //game.load.image('gameOver',"/assets/images/gameover.jpg");
    },

    create: function (){
        //var image = game.add.sprite(0,0,'gameOver');
        //image.anchor.setTo(0.5,0.5);
        //image.scale.setTo(0.7,0.7);

        var style = { font: "bold 40px Arial", fill: "#fff", boundsAlignH: "center"};
        var text = game.add.text(game.world.centerX - 100, game.world.centerY - 50, "Game Over", style);
        //text.setShadow(3, 3, 'rgba(255,255,255,0.5)', 2);
    },
    
    update: function(){
        
    }
};