game = new Phaser.Game(600, 450, Phaser.AUTO, '');

game.state.add('gameState',gameState);
game.state.start('gameState');
