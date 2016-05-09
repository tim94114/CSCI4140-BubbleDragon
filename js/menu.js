var bubbleDragon = bubbleDragon || {};

bubbleDragon.menu = function(game) {
	
};

bubbleDragon.menu.prototype ={
	
	preload: function () {

	},
	
	create: function () {
		//start game text
		var text = "Please click to Begin!!!";
		var style = { font: "30px Arial", fill: "#fff", align: "center" };
		var t = this.game.add.text(600, 500, text, style);
		t.anchor.set(0.5);
	},
	
	update: function () {
		this.ready = true;
		if(this.game.input.activePointer.justPressed()) {
			this.state.start('game');
		}

	}
	
};