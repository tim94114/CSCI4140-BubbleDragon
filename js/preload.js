var bubbleDragon = bubbleDragon || {};

bubbleDragon.preload = function(game) {
	
};

bubbleDragon.preload.prototype ={
	
	preload: function () {
		this.game.load.audio('boden', ['assets/audio/bg.mp3']);
		this.game.load.image('sky', 'assets/sky.png');
		this.game.load.image('ground', 'assets/platform.png');
		this.game.load.image('bubble', 'assets/bubble.png');
		this.game.load.spritesheet('ghost', 'assets/enemy1.png', 38, 32,5);
		this.game.load.spritesheet('dragon', 'assets/bubble_dragon(anim).png', 104, 104,2);
	},
	
	create: function () {

	},
	
	update: function () {
		this.ready = true;
		this.state.start('menu');
	}
	
};