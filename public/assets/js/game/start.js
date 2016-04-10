game = new Phaser.Game(650, 500, Phaser.AUTO, '');

game.state.add('gameState',gameState);
game.state.start('gameState');
