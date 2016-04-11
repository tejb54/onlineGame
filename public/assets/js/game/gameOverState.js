/**
 * Created by Tobias on 2016-04-11.
 */
var gameOverState = {

    preload: function (){
        game.load.image('gameOver',"/assets/images/gameover.jpg");
    },

    create: function (){
        var image = game.add.sprite(0,0,'gameOver');
        //image.anchor.setTo(0.5,0.5);
        image.scale.setTo(0.7,0.7);
    }
};