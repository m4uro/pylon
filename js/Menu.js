Pylon.Menu = function(game) {
	Phaser.Group.call(this, game, game.world);
	
	this.height = 50;
	this.offset = 20;

	this.game = game;
	this.updateAbsolutePos();
	this.fixedToCamera = true;
 	
 	this.x = this.offset;
 	this.y = game.height + this.height;
 	this.currentScope = null; /* this will be the character object */
 	this.constructorIcon = new Pylon.MenuButtonConstructor(this, this.x, this.y);
 	this.otherIcon = new Pylon.MenuButtonConstructor(this, this.x + 50, this.y);
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
    	sprite.hideOptions(); 
    	game.add.tween(sprite)
    		.to({ x: sprite.x, y: this.originalPos.y + this.offset + this.height }, 1000, Phaser.Easing.Bounce.Out, false, delay += delay).start();
    }, this); 

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
    		.to({ x: sprite.x, y: this.originalPos.y }, 1000, Phaser.Easing.Bounce.Out, false, delay += delay).start();
    }, this);

    
}