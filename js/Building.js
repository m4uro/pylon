Pylon.Building = function (game, x, y, buildingInfo) {
    Phaser.Sprite.call(this, game, x, y, 'buildings', buildingInfo.icon + '0000');
//    this.inputEnabled = true;
//    this.input.pixelPerfectClick = true;
//    this.events.onInputDown.add(this.launch, this);
    this.complete = false;
    this.anchor.setTo(0.5, 0.9);
    this.alpha = 0.5;
    this.health = 0;
    this.maxHealth = buildingInfo.hp;
    this.rotation = game.physics.arcade.angleBetween(this, Py.selected.planet) - Math.PI/2;
};

Pylon.Building.prototype = Object.create(Phaser.Sprite.prototype);
Pylon.Building.prototype.constructor = Pylon.Building;

//Returns true when finished building
Pylon.Building.prototype.build = function (qty) {
    if (qty + this.health >= this.maxHealth) {
        this.health = this.maxHealth;
        this.alpha = 1;
        return true;
    }
    else {
        this.health += qty;
        return false;
    }
};