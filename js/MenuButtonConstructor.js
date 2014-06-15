Pylon.MenuButtonConstructor = function(group, x, y) {
	Phaser.Sprite.call(this, game, x, y, 'constructorIcon');
	this.group = group;
	this.group.add(this);

	this.inputEnabled = true;
	this.events.onInputDown.add(this.clicked, this);
}
Pylon.MenuButtonConstructor.prototype = Object.create(Phaser.Sprite.prototype);
Pylon.MenuButtonConstructor.prototype.constructor = Pylon.MenuButtonConstructor;

Pylon.MenuButtonConstructor.prototype.clicked = function(sprite, pointer) {
	//call planet to show the available spots
	Py.selected.planet.showSlotsToBuild();
}

/* Every MenuButton has to implement hideOptions to hide all the consecuent rendered items */
Pylon.MenuButtonConstructor.prototype.hideOptions = function() {
	Py.selected.planet.hideSlotsToBuild();
}

