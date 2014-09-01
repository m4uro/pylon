var cursors;
Pylon.Spaceship = function (game, x, y, planet) {
//    Phaser.Sprite.call(this, game, x, y, 'spaceship');
    Phaser.Sprite.call(this, game, x, y, 'buildings', 'spaceship0000');
    this.inputEnabled = true;
    this.input.pixelPerfectClick = true;
    this.events.onInputDown.add(this.clicked, this);
    this.ignited = false;
    game.physics.p2.enable(this);
    this.anchor.setTo(0.5, 0.9);
    this.body.collideWorldBounds = false;
    this.body.setCircle(10);
    this.body.data.shapeOffsets[0] = p2.vec2.fromValues(0,0.7);
    this.planet = planet;
    this.empty = true;
    
//    this.body.debug = true;
    
    cursors = game.input.keyboard.createCursorKeys();
};

Pylon.Spaceship.prototype = Object.create(Phaser.Sprite.prototype);
Pylon.Spaceship.prototype.constructor = Pylon.Spaceship;

Pylon.Spaceship.prototype.clicked = function (sprite, pointer) {
    //pointer: left, middle, right / 0, 1, 2
    console.log('You clicked ' + sprite.key);
    if ((pointer.button === 2) && (Py.selected)) {
        //if character planet is the same as the sprite planet
        if (Py.selected.planet === sprite.planet) {
            //set character to extract this
            Py.selected.targetShip = sprite;
        }
    }
    else {
//        this.body.moveTo(200, game.math.radToDeg(this.rotation-Math.PI/2));//ninja
//        this.body.velocity = game.physics.arcade.velocityFromRotation(this.rotation-Math.PI/2, 200);//arcade
        this.body.moveForward(200);
        this.ignited = true;
        this.timer = game.time.events.add(350, function () {
            this.flying = true;
            this.body.collides(Py.planetCollisionGroup, collisionHandler, this);
        }, this);
    }
};

Pylon.Spaceship.prototype.update = function () {
//    game.physics.ninja.collide(this, Py.red);
//    this.body.shape.pos.x += 0.001;
    if (this.ignited) {
        var i, Fx, Fy, alpha, aux, r;
        Fx = 0;
        Fy = 0;
        for (i = 0; i < Py.planets.length; i++) {
            r = game.physics.arcade.distanceBetween(this, Py.planets[i]);
            alpha = game.physics.arcade.angleBetween(this, Py.planets[i]);
            aux = Py.planets[i].mass/(r * r)
            Fx += aux * Math.cos(alpha);
            Fy += aux * Math.sin(alpha);
        }
        this.body.force.x = Fx/80;
        this.body.force.y = Fy/80;
        
    }
    if (this.flying) {
        
        this.body.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x) - Math.PI/2;
//        game.physics.arcade.collide(this, Py.planetGroup, collisionHandler, checkIntersect, this);
    }
    
    
    if (cursors.left.isDown)
    {
    	Py.s.body.rotateLeft(80);
    }
    else if (cursors.right.isDown)
    {
    	Py.s.body.rotateRight(80);
    }
    else
    {
        Py.s.body.setZeroRotation();
    }

    if (cursors.up.isDown)
    {
    	Py.s.body.thrust(50);
    }
    else if (cursors.down.isDown)
    {
    	Py.s.body.reverse(50);
    }
};

function collisionHandler (spaceship, planetBody) {
//    if (game.physics.arcade.distanceBetween(spaceship, planet) < planet.sprite.radius) {
//        this.ignited = false;
//        this.flying = false;
//        this.body.setZeroVelocity();
//        this.body.setZeroForce();
//        this.body.setZeroRotation();
//    }
    this.body.velocity.x *= 0.5;
    this.body.velocity.y *= 0.5;
    console.log('hit');
//    this.ignited = false;
    this.flying = false;
    
    if (this.passenger) {
        this.passenger.visible = true;
        this.passenger.planet = planetBody.sprite;
        this.passenger.currentAngle = Phaser.Math.radToDeg(game.physics.arcade.angleBetween(spaceship, planetBody) + Math.PI);//Math.floor(Math.random()*360);
        Py.messages.newMessage('' + Phaser.Math.radToDeg(game.physics.arcade.angleBetween(spaceship, planetBody) + Math.PI));
        this.passenger.cancelActions();
        this.passenger.play('idle');
        this.loadTexture('buildings', 'spaceship0000');
        this.empty = true;
        this.passenger = null;
    }
//    this.body.setZeroVelocity();
//    this.body.setZeroForce();
//    this.body.setZeroRotation();
}
