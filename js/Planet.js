Pylon.Planet = function (x, y, radius, bsu) {
    
    var bmd = game.add.bitmapData(2*radius,2*radius);    
    
    bmd.ctx.beginPath();
    bmd.ctx.arc(radius, radius, radius, 0, 2 * Math.PI, false);
    bmd.ctx.fillStyle = 'blue';
    bmd.ctx.fill();
//    bmd.ctx.lineWidth = 5;
//    bmd.ctx.strokeStyle = '#003300';
//    bmd.ctx.stroke();
    
    Phaser.Sprite.call(this, game, x, y, bmd);
    
    this.bsu = bsu || 60;
    this.resourceMap = {
        mineral: 0.5,
        wood: 0.5
    };
    this.circle = new Phaser.Circle(x, y, radius * 2);
//    this.x = x;
//    this.y = y;
    this.radius = radius;
    this.mass = 100 * Math.pow(this.radius, 3); //TEMP 16 is a constant that should be determined properly
    
    this.anchor.setTo(0.5,0.5);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.immovable = true;
};

Pylon.Planet.prototype = Object.create(Phaser.Sprite.prototype);
Pylon.Planet.prototype.constructor = Pylon.Planet;

Pylon.Planet.prototype.getResource = function (rnd) {
        var number = 0;
        for (res in this.resourceMap) {
            if (typeof this.resourceMap[res] !== 'function') {
                number += this.resourceMap[res];
                if (rnd < number) return res;
            }
        }
};

