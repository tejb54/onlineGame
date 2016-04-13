game = new Phaser.Game(650, 500, Phaser.AUTO, 'gameDiv');

game.state.add('gameState',gameState);
game.state.add('gameOverState',gameOverState);
game.state.start('gameState');
