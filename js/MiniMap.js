Pylon.MiniMap = function(game) {
	Phaser.Group.call(this, game, game.world);
	/* Defaults */
	var minimapOffset = 10;
		scale = 0.05, //times smaller than real world
		width = game.world.width*scale,
		height = game.world.height*scale,
		posX = game.width - width - minimapOffset,
		posY = game.height - height - minimapOffset,
		viewport = null;
    this.characters = [];
    
    this.minimapOffset = minimapOffset;
   	this.x = posX;
   	this.y = posY;
   	this.absolutePos = { x: this.x, y: this.y};
    this.fixedToCamera = true;
    this.scale = new Phaser.Point(scale, scale);
 	
 	bg = this.create(0,0, 'minimap');
 	bg.width = game.world.width;
    bg.height = game.world.height;
    bg.inputEnabled = true;
    bg.events.onInputDown.add(this.onClickedMinimap, this);

 	viewport = this.create(0,0,'viewport');
 	viewport.width = game.width + minimapOffset;//width of the borders
    viewport.height = game.height + minimapOffset;//width of the borders
 	viewport.bringToTop();
 	this.viewport = viewport;

}
Pylon.MiniMap.prototype = Object.create(Phaser.Group.prototype);
Pylon.MiniMap.prototype.constructor = Pylon.MiniMap;
Pylon.MiniMap.prototype.updateViewport = function(x, y) {
	this.viewport.x = x;
	this.viewport.y = y;
}

Pylon.MiniMap.prototype.addCharacter = function(id, x, y, sprite) {
	//this.characters[id] = this.create(x,y, sprite);
	
};

Pylon.MiniMap.prototype.updateCharacter = function(id, x, y, rotation) {
	/*var current = this.characters[id];
	current.x = x;
	current.y = y;
	current.rotation = rotation;*/
};

Pylon.MiniMap.prototype.onClickedMinimap = function(sprite, key) {
	var relativePos = {
		x: key.position.x - this.absolutePos.x,
		y: key.position.y - this.absolutePos.y
	};
	this.mouseDown = true;
	camera.absoluteMove( (relativePos.x )/this.scale.x - (this.viewport.width / 2) ,
			(relativePos.y )/this.scale.y - this.viewport.height / 2);
}