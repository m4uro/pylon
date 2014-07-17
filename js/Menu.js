Pylon.Menu = function(game) {
	Phaser.Group.call(this, game, game.world);
	
	this.height = 80;
	this.offset = 60;

	this.game = game;
	this.updateAbsolutePos();
	this.fixedToCamera = true;
 	
 	this.x = this.offset;
 	this.y = game.height + this.height;
 	this.currentScope = null; /* this will be the character object */
// 	this.constructorIcon = new Pylon.MenuButtonConstructor(this, this.x, this.y);
// 	this.otherIcon = new Pylon.MenuButtonConstructor(this, this.x + 50, this.y);
    
    this.constructorIcon = game.add.button(this.x, this.y, 'icons', this.clickHammer, this, 'hammer0001', 'hammer0000', 'hammer0003', 'hammer0001');
    this.constructorIcon.anchor.setTo(0.5, 1);
    this.add(this.constructorIcon);
}
Pylon.Menu.prototype = Object.create(Phaser.Group.prototype);
Pylon.Menu.prototype.constructor = Pylon.Menu;

Pylon.Menu.prototype.updateAbsolutePos = function() {
	this.originalPos = { x: this.offset, y: game.height - this.offset - this.height};
	this.hide();
}

Pylon.Menu.prototype.hide = function() {
    var tween = null,
    	delay = 100; /* delay between showing sprites*/
    this.forEach(function(sprite) {
//    	sprite.hideOptions();
        if (Py.selected) Py.selected.planet.hideSlotsToBuild();
    	game.add.tween(sprite)
    		.to({ y: game.height + this.height }, 200, Phaser.Easing.Linear.None, false, 0).start();
//    		.to({ x: sprite.x, y: this.originalPos.y + this.offset + this.height }, 1000, Phaser.Easing.Bounce.Out, false, delay += delay).start(); MAXI
    }, this); 
    this.hidden = true;
}

Pylon.Menu.prototype.show = function(sprite) {
    var menu = this,
    	tween = null,
    	delay = 100; /* delay between showing sprites*/

    game.world.remove(this);
    game.world.add(this);
    /* We will show every button :) */
    this.forEach(function(sprite) {
    	game.add.tween(sprite)
    		.to({ y: game.height }, 200, Phaser.Easing.Linear.None, false, 0).start();
//    		.to({ x: sprite.x, y: this.originalPos.y }, 1000, Phaser.Easing.Bounce.Out, false, delay += delay).start(); MAXI
    }, this);
    this.hidden = false;
}


Pylon.Menu.prototype.clickHammer = function() {
    if (Py.selected && !Py.menu.hidden) {
        Py.selected.planet.showSlotsToBuild();
        Py.menu.forEach(function(sprite) {
            game.add.tween(sprite)
                .to({ y: game.height + Py.menu.height }, 200, Phaser.Easing.Linear.None, false, 0).start();
        }, this);
        Py.menu.hidden = true;
    }
}