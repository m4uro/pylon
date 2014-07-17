Pylon.Messages = function (game) {
    Phaser.Group.call(this, game);
    this.fixedToCamera = true;
    this.cameraOffset.setTo(100, game.height - 30);
    this.index = 0;
    this.nextY = this.cameraOffset.y;
    this.number = 0;
    this.messageTTL = Phaser.Timer.SECOND * 5;
};

Pylon.Messages.prototype = Object.create(Phaser.Group.prototype);
Pylon.Messages.prototype.constructor = Pylon.Messages;

Pylon.Messages.prototype.updatePos = function () {
    this.nextY = game.height - this.number *30;
    this.cameraOffset.setTo(100, this.nextY);
}

Pylon.Messages.prototype.newMessage = function (mes) {
    var bmd, text, box, aux,
        val1,
        w = 600,//function of the screen size
        h,
        padding = 10;
    
    this.number++;
    
    text = game.add.bitmapText(15, this.index + padding/2, 'eurostyle', (mes).toString().toUpperCase(), 15);
    this.add(text);
    text.alpha = 0.01;
    game.add.tween(text).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 0, false);
    
    h = text.textHeight + padding;
    val1 = h + padding/2;
    
    //tween the group to a higher position
    if (this.number > 1) {
        this.nextY -= val1;
        aux = game.add.tween(this.cameraOffset).to( {y: this.nextY}, 1000, Phaser.Easing.Linear.None, true, 0, false);
//        aux.onComplete.addOnce(this.updatePos, this);
    }
    
    bmd = game.add.bitmapData(w, h);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, w, h);
    bmd.ctx.fillStyle = '#333333';
    bmd.ctx.fill();
      
    box = game.add.sprite(0, this.index, bmd);
    this.add(box);
    box.alpha = 0.01;
    game.add.tween(box).to({alpha: 0.6}, 1000, Phaser.Easing.Linear.None, true, 0, false);
    this.index += val1;
    this.remove(text);
    this.add(text);
    
    //timer to destroy the object once its time to live has expired
    game.time.events.add(this.messageTTL, function () {
        var t;
        t = game.add.tween(box).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true, 0, false);
        game.add.tween(text).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true, 0, false);
        t.onComplete.addOnce(function() {box.destroy(); text.destroy();}, this);
    }, this);
}