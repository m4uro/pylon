Pylon.PlanetSlotMenu = function(x, y) {
	Phaser.Sprite.call(this, game, x, y, 'red');
	
	this.inputEnabled = true;
	this.events.onInputDown.add(this.clicked, this);
	
	this.buildingOptions = game.add.group();
	
}
Pylon.PlanetSlotMenu.prototype = Object.create(Phaser.Sprite.prototype);
Pylon.PlanetSlotMenu.prototype.constructor = Pylon.PlanetSlotMenu;

Pylon.PlanetSlotMenu.prototype.destroy = function() {
	//destroy menu
	this.buildingOptions.removeAll(true);
	this.kill();
}

Pylon.PlanetSlotMenu.prototype.clicked = function(sprite, pointer) {	
	var i = 0,
		aux,
		point,
		length = 0,
		buildings = GameSettings[Py.selected.team].buildings,
		radius = 50;

	
	
    this.circle = new Phaser.Circle(this.x, this.y, radius * 2);
    for(i = 0, length = buildings.length; i < length; i++) {
        point = this.circle.circumferencePoint(360/length * i, true);
        aux = game.add.sprite(point.x, point.y, buildings[i].icon); 
    //    aux.anchor.setTo(0.5, 0.9);       
        this.buildingOptions.add(aux);
    }
    game.world.remove(this.buildingOptions);
    game.world.add(this.buildingOptions);
}
