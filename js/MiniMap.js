Pylon.MiniMap = function(game) {
	Phaser.Group.call(this, game, game.world);
	
    this.characters = [];
    this.bg = this.create(0,0, 'minimap');
    this.bg.inputEnabled = true;
 	this.viewport = this.create(0,0,'viewport');
    this.bg.events.onInputDown.add(this.onClickedMinimap, this);
    this.bg.events.onInputUp.add(this.onOutMinimap, this);

    this.setSizeAndPosition();
 	
}
Pylon.MiniMap.prototype = Object.create(Phaser.Group.prototype);
Pylon.MiniMap.prototype.constructor = Pylon.MiniMap;

Pylon.MiniMap.prototype.setSizeAndPosition = function() {
	/* Defaults */
	var minimapOffset = 10, 
		viewportBorder = 5,
		scale = 0.05, //times smaller than real world
		width = game.world.width*scale,
		height = game.world.height*scale,
		posX = game.width - width - minimapOffset,
		posY = game.height - height - minimapOffset
		
    this.minimapOffset = minimapOffset;
   	this.x = posX;
   	this.y = posY;
   	this.absolutePos = { x: this.x, y: this.y};
    this.fixedToCamera = true;
    this.scale = new Phaser.Point(scale, scale);
 	
 	
 	this.bg.width = game.world.width;
    this.bg.height = game.world.height;

 	this.viewport.width = game.width + viewportBorder;//width of the borders
    this.viewport.height = game.height + viewportBorder;//width of the borders

};

Pylon.MiniMap.prototype.updateViewport = function(x, y) {
	this.viewport.x = x;
	this.viewport.y = y;
}
Pylon.MiniMap.prototype.updateZ = function() {
	this.game.world.remove(this);
	this.game.world.add(this);
	this.remove(this.viewport);
	this.add(this.viewport);
}

Pylon.MiniMap.prototype.addCharacter = function(id, x, y, sprite) {
	this.characters[id] = this.create(x,y, sprite);
	
};

Pylon.MiniMap.prototype.updateCharacter = function(id, x, y, rotation) {
	var current = this.characters[id];
	current.x = x;
	current.y = y;
	current.rotation = rotation;
};

Pylon.MiniMap.prototype.onClickedMinimap = function(sprite, key) {
	var relativePos = {
		x: key.position.x - this.absolutePos.x,
		y: key.position.y - this.absolutePos.y
	};
	this.mouseDown = true;
	Py.camera.absoluteMove( (relativePos.x )/this.scale.x - (this.viewport.width / 2) ,
			(relativePos.y )/this.scale.y - this.viewport.height / 2);
}
Pylon.MiniMap.prototype.onOverMinimap = function(position) {
	var relativePos = {
		x: position.x - this.absolutePos.x,
		y: position.y - this.absolutePos.y
	};
	
	if(this.mouseDown) {
		Py.camera.absoluteMove( (relativePos.x )/this.scale.x - (this.viewport.width / 2) ,
			(relativePos.y )/this.scale.y - this.viewport.height / 2);
	}
}
Pylon.MiniMap.prototype.onOutMinimap = function(sprite, key) {
	this.mouseDown = false;
	
}