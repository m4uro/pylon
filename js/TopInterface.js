Pylon.TopInterface = function(game) {
	Phaser.Group.call(this, game);
    var res, aux,
        i = 0;
	
    this.fixedToCamera = true;
	
    for (res in GameSettings.Team1.resources) {
        
        aux = game.add.sprite(58 + 140 * i, 0, 'icons', 'resBack0000');
        aux.anchor.setTo(0.49, 0);
        this.add(aux);
        
        aux = game.add.sprite(30 + 140 * i, 25, 'icons', 'mini' + res.charAt(0).toUpperCase() + res.substring(1,res.length) + '0000');
        aux.anchor.setTo(0.49, 1);
        this.add(aux);
        
        this[res] = game.add.bitmapText(63 + 140 * i, 5, 'euroObl', GameSettings.Team1.resources[res].toString(), 20);//TODO replace with current team
        this.add(this[res]);
        
        i++;
    }
    //over, out, down, up
    this.settingsB = game.add.button(25 +140 * i, 0, 'icons', null, this, 'settings0001', 'settings0000','settings0003','settings0001');
    this.settingsB.anchor.setTo(0.48, 0);
    this.add(this.settingsB);
    this.W = 140 * i + 70;
    this.cameraOffset.x = game.width - this.W;
}
Pylon.TopInterface.prototype = Object.create(Phaser.Group.prototype);
Pylon.TopInterface.prototype.constructor = Pylon.TopInterface;

Pylon.TopInterface.prototype.updatePos = function () {
    this.cameraOffset.x = game.width - this.W;
}