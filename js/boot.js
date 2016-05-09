var bubbleDragon = bubbleDragon || {};

bubbleDragon.boot = function (game) {};

bubbleDragon.boot.prototype = {
	preload: function(){

	},
	
	create: function(){
		this.input.maxPointers=1;
		this.game.stage.backgroundColor = '#000 ';
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.state.start('preload');
	}
	
};