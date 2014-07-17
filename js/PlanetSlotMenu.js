Pylon.PlanetSlotMenu = function(x, y) {
//	Phaser.Sprite.call(this, game, x, y, 'icons', 'slot0000');
    Phaser.Sprite.call(this, game, x, y, 'slot');
	
	this.inputEnabled = true;
	this.events.onInputDown.add(this.clicked, this);
	this.alpha = 0.9;
    
	this.buildingOptions = game.add.group();
}

Pylon.PlanetSlotMenu.prototype = Object.create(Phaser.Sprite.prototype);
Pylon.PlanetSlotMenu.prototype.constructor = Pylon.PlanetSlotMenu;

Pylon.PlanetSlotMenu.prototype.destroy = function() {
	//destroy menu
	this.buildingOptions.removeAll(true);
    if (this.circleSprite) this.circleSprite.destroy();
	this.kill();
}

Pylon.PlanetSlotMenu.prototype.clicked = function(sprite, pointer) {	
	var i = 0,
		aux,
        iName,
		point,
		length = 0,
		buildings = GameSettings[Py.selected.team].buildings,
		radius = 50;

	
	
    this.circle = new Phaser.Circle(this.x, this.y, radius * 2);
    
    for(i = 0, length = buildings.length; i < length; i++) {
        point = this.circle.circumferencePoint(360/length * i, true);
//        aux = game.add.sprite(point.x, point.y, buildings[i].icon); 
//        aux.anchor.setTo(0.5, 0.9);       
//        this.buildingOptions.add(aux);
        
        iName = buildings[i].icon;
//        aux = game.add.button(point.x, point.y, 'icons', null, this, iName+'0001', iName+'0000', iName+'0006', iName+'0001');
//        aux = game.add.button(point.x, point.y, 'icons', this.optionClicked, this, iName+'0001', iName+'0000', iName+'0006', iName+'0001');
        aux = game.add.button(this.x, this.y, 'icons', this.optionClicked, this, iName+'0001', iName+'0000', iName+'0006', iName+'0001');
        aux.anchor.setTo(0.48, 0.48);
        aux.building = buildings[i];
        aux.scale.setTo(0.2, 0.2);
        game.add.tween(aux.scale).to({x: 1, y: 1}, 250, Phaser.Easing.Linear.None, true, 0, false);
        game.add.tween(aux).to({x: point.x, y: point.y}, 150, Phaser.Easing.Linear.None, true, 0, false);
        this.buildingOptions.add(aux);
//        aux.onInputUp.add(this.optionClicked(point.x, point.y), this);
    }
    this.circleSprite = game.add.sprite(this.x, this.y, 'icons', 'circle0000');
    this.circleSprite.anchor.setTo(0.5, 0.5);
    this.circleSprite.scale.setTo(0.2, 0.2);
    game.add.tween(this.circleSprite.scale).to({x: 1, y: 1}, 100, Phaser.Easing.Linear.None, true, 0, false);
    
    game.world.remove(this.buildingOptions);
    game.world.add(this.buildingOptions);
    
    this.inputEnabled = false;
    Py.selected.planet.hideSlotsToBuild(this);
}


Pylon.PlanetSlotMenu.prototype.optionClicked = function(button, pointer) {
    //show info and create button
    var bmd, b, w, h, info, aux, res,
        of = 5,
        qty = 0;
        info = game.add.group();
    
    b = button.building;
    aux = game.add.bitmapText(button.x + 15, button.y + 10, 'eurostyle', b.icon.toUpperCase(), 20);
    w = aux.textWidth + 30;
    info.add(aux);
    aux.alpha = 0.1;
    game.add.tween(aux).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true, 0, false);
    
    for (res in b.cost) {
        if (b.cost.hasOwnProperty(res)) {
            console.log(res + '   ' + b.cost[res]);
            info.create(button.x + (w - 60)/2, button.y + 35 + 25 * qty, 'icons', 'mini' + res.charAt(0).toUpperCase() + res.substring(1,res.length) + '0000');
            aux = game.add.bitmapText(button.x + (w - 60)/2 + 30, button.y + 37 + 25 * qty, 'euroObl', b.cost[res].toString(), 18);
            info.add(aux);
            aux.alpha = 0.1;
            game.add.tween(aux).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true, 0, false);
            qty++;
        }
    }
    console.log(qty);

    h = 65 + qty * 20;
    
    bmd = game.add.bitmapData(w, h);
    // draw to the canvas context like normal
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, w, h);
    bmd.ctx.fillStyle = '#333333';
    bmd.ctx.fill();

    // use the bitmap data as the texture for the sprite
    aux = game.add.sprite(button.x + w/2, button.y + h, bmd);
    aux.alpha = 0.6;
    aux.anchor.setTo(0.5, 1);
    aux.scale.y = 0.1;
    info.add(aux);
    info.sendToBack(aux);
    game.add.tween(aux.scale).to({y: 1}, 300, Phaser.Easing.Linear.None, true, 0, false);
    
    
    //TODO replace null callback with build action procedure
    aux = game.add.button(button.x + w/2, button.y + h, 'icons', null, this, 'ok0002', 'ok0000','ok0004','ok0002');
    aux.anchor.setTo(0.48, 0.48);
    info.add(aux);
    
    info.x -= w/2;
    info.y -= h;
    
    this.buildingOptions.removeAll(true);
    if (this.circleSprite) this.circleSprite.destroy();
}