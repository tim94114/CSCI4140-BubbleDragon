var bubbleDragon = bubbleDragon || {};

bubbleDragon.game = function(game) {

}

var bgMusic;
var player;
var platforms;
var cursors;
var bubbles;
var score = 0;
var scoreText;
var bullets;
var fireRate = 1000;
var nextFire = 0;
var shootDirectionX = 150;
var spaceKey;
    
var ghosts;
var anim;

bubbleDragon.game.prototype = {
	create: function() {
		this.backgroundSetup();
		this.playerSetup();
		this.bubbleSetup();
		this.itemSetup();
		this.enemySetup();
		this.scoreSetup();
	},
	
	update: function(){
		this.collisionDetect();
		this.playerControl();
	},
	
	// -------------Functions called in create-----------------
	
	backgroundSetup: function(){
				//-----------Background SETUP--------------
		//Play background Music
		bgMusic = this.game.add.audio('boden');
		bgMusic.play();
		
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		
		//background
		this.game.add.sprite(0, 0, 'sky');
		
		platforms = this.game.add.group();

		//  We will enable physics for any object that is created in this group
		platforms.enableBody = true;

		// Here we create the ground.
		var ground = platforms.create(0, this.game.world.height - 64, 'ground');

		//  Scale it to fit the width of the game (the original sprite is 400x32 in size)
		ground.scale.setTo(2, 2);

		//  This stops it from falling away when you jump on it
		ground.body.immovable = true;

		//  Now let's create two ledges
		var ledge = platforms.create(400, 400, 'ground');
		ledge.body.immovable = true;

		ledge = platforms.create(-150, 250, 'ground');
		ledge.body.immovable = true;

	},
	
	playerSetup: function(){
		// The player and its settings
		player = this.game.add.sprite(104, this.game.world.height - 150, 'dragon');
		player.scale.setTo(0.5, 0.5);
		//  We need to enable physics on the player
		this.game.physics.arcade.enable(player);

		//  Player physics properties. Give the little guy a slight bounce.
		player.body.bounce.y = 0;
		player.body.gravity.y = 500;
		player.body.collideWorldBounds = true;

		//  Our two animations, walking left and right.
		player.animations.add('left', [0], 10, true);
		player.animations.add('right', [1], 10, true);
		
		//  Our controls.
		cursors = this.game.input.keyboard.createCursorKeys();
		
		//detect spacebar input
		spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR ]);

	},
	
	bubbleSetup: function(){
		    //shooting
		bullets = this.game.add.group();
		bullets.enableBody = true;
		bullets.physicsBodyType = Phaser.Physics.ARCADE;

		bullets.createMultiple(50, 'bubble');
		bullets.setAll('checkWorldBounds', true);
		bullets.setAll('outOfBoundsKill', true);
	},
	
	itemSetup: function(){
		//  Finally some stars to collect
		bubbles = this.game.add.group();
		
		//  We will enable physics for any star that is created in this group
		bubbles.enableBody = true;
		
		//  Here we'll create 12 of them evenly spaced apart
		for (var i = 0; i < 12; i++)
		{
			//  Create a star inside of the 'stars' group
			var bubble = bubbles.create(i * 70, 0, 'bubble');

			//  Let gravity do its thing
			bubble.body.gravity.y = 300;

			//  This just gives each star a slightly random bounce value
			bubble.body.bounce.y = 0.7 + Math.random() * 0.2;
		}
	},
	
	enemySetup: function(){
		ghosts = this.game.add.group();
		ghosts.enableBody = true;
		//ghost
		ghost = this.game.add.sprite(0, 0, 'ghost', 5);
		//ghost.enableBody = true;
		//ghost.physicsBodyType = Phaser.Physics.ARCADE;
		this.game.physics.arcade.enable(ghost);
		ghost.scale.set(2,2);
		ghost.smoothed = false;
		
		anim = ghost.animations.add('walk');

		//anim.onStart.add(animationStarted, this);
		//anim.onLoop.add(animationLooped, this);
		//anim.onComplete.add(animationStopped, this);

		anim.play(10, true);
		
	},
	
	
	
	scoreSetup: function(){
		//  The score
		scoreText = this.game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
	},
	
	//-------------Functions called in Update-----------------
	collisionDetect: function(){
		//  Collide the player and the stars with the platforms
		this.game.physics.arcade.collide(player, platforms);
		this.game.physics.arcade.collide(bubbles, platforms);
		this.game.physics.arcade.collide(player, ghost);
		//  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
		this.game.physics.arcade.overlap(player, bubbles, this.collectBubble, null, this);
		this.game.physics.arcade.moveToXY(ghost, player.x, player.y, 100);
		
		bullets.forEachAlive(function(item) {
        this.game.physics.arcade.overlap(item, ghost, this.collectEnemy, null, this);
        this.game.physics.arcade.overlap(player, item, this.collideBullet, null, this);
        if( this.math.fuzzyEqual(item.x,item.endPointX,5) && this.math.fuzzyEqual(item.y,item.endPointY,5) ){
            //item.kill();

            this.game.physics.arcade.moveToXY(item, item.x, item.y - 150, 100);
        }             
		},this);
		
	},
	
	playerControl: function(){
		//  Reset the players velocity (movement)
		player.body.velocity.x = 0;

		if (cursors.left.isDown)
		{
			//  Move to the left
			player.body.velocity.x = -150;
			player.animations.play('left');
			// update the shooting direction
			shootDirectionX = -150;
		}
		else if (cursors.right.isDown)
		{
			//  Move to the right
			player.body.velocity.x = 150;
			player.animations.play('right');
			// update the shooting direction
			shootDirectionX = 150;
		}
		else
		{
			//  Stand still
			player.animations.stop();

		}
		
		//  Allow the player to jump if they are touching the ground.
		if (cursors.up.isDown && player.body.touching.down)
		{
			player.body.velocity.y = -350;
		}

		if (spaceKey.isDown){
			this.shootBubble();
		}
	},
	
	// ----------------------- Callback functions used above-----------------------------
	collectBubble: function (player, bubble){
		// Removes the bubble from the screen
		bubble.kill();
		//  Add and update the score
		score += 10;
		scoreText.text = 'Score: ' + score;
	},
	
	collectEnemy: function (bullet, ghost){
		// Removes the bubble from the screen
		bullet.kill();
		ghost.kill();
		//  Add and update the score
		score += 10;
		scoreText.text = 'Score: ' + score
	},
	
	collideBullet: function (player, bullet) {
    // Removes the bubble from the screen
		// bullet.kill();
		if (player.y < bullet.y - 5 && player.x < bullet.x + 20 && player.x > bullet.x - 20){
			this.game.physics.arcade.collide(bullet, player);
			bullet.body.immovable = true;
		} else if (player.y > bullet.y + 5 && player.x < bullet.x + 20 && player.x > bullet.x - 20){
			bullet.kill();
		}
	},
	
	shootBubble: function() {

	if (this.game.time.now > nextFire && bullets.countDead() > 0)
		{
			nextFire = this.game.time.now + fireRate;
			
			var bullet = bullets.getFirstDead();
			bullet.endPointX = player.x + shootDirectionX;
			bullet.endPointY = player.y;
			bullet.reset(player.x, player.y);

			this.game.physics.arcade.moveToXY(bullet, player.x + shootDirectionX, player.y, 300);
		}

	}
}

    