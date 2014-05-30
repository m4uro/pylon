Pylon.Spaceship = function (game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'spaceship');
    this.inputEnabled = true;
    this.input.pixelPerfectClick = true;
    this.events.onInputDown.add(this.launch, this);
    this.ignited = false;
    game.physics.enable(this, Phaser.Physics.ARCADE);
};

Pylon.Spaceship.prototype = Object.create(Phaser.Sprite.prototype);
Pylon.Spaceship.prototype.constructor = Pylon.Spaceship;

Pylon.Spaceship.prototype.launch = function (sprite, pointer) {
    //pointer: left, middle, right / 0, 1, 2
    console.log('You clicked ' + sprite.key);
    this.body.velocity = game.physics.arcade.velocityFromRotation(this.rotation-Math.PI/2, 200);
    this.ignited = true;
};

Pylon.Spaceship.prototype.update = function () {
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
        this.body.acceleration.x = Fx/100;
        this.body.acceleration.y = Fy/100;
        this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x) + Math.PI/2;
    }
};