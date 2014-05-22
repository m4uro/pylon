Pylon.Character = function (game, x, y, key) {

    Phaser.Sprite.call(this, game, x, y, key);
};

Pylon.Character.prototype = Object.create(Phaser.Sprite.prototype);
Pylon.Character.prototype.constructor = Pylon.Character;

Pylon.Character.prototype.init = function () {
    this.anchor.setTo(0.5, 0.88);
    this.scale.setTo(0.7, 0.7);
    this.play('idle');
    this.planet = Py.planets[0];
    this.targetResource = null;
    this.busy = false;
    this.angularSpeed = 0;
};