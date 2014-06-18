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
    this.radius = radius;
    this.mass = 100 * Math.pow(this.radius, 3); //TEMP 16 is a constant that should be determined properly
    
    this.anchor.setTo(0.5,0.5);

    Py.minimap.create(x-radius, y-radius, bmd);
    this.slotsToBuild = game.add.group();
//    game.physics.enable(this, Phaser.Physics.ARCADE);
//    this.body.immovable = true;
    game.physics.p2.enable(this, true);
    this.body.setCircle(this.radius);
//    this.body.motionState = Phaser.Physics.P2.Body.STATIC;
    this.body.static = true;
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

Pylon.Planet.prototype.setSlots = function() {
    var planet = this, point, aux,
        i = 0,
        slots = Math.floor(planet.circle.circumference() / planet.bsu);
    for (i = 0; i < slots; i++) {
        if (Math.random() <= 0.6) {
            point = planet.circle.circumferencePoint(360/slots * i, true);
            //TEMP 50 as resource quantity
            aux = new Pylon.Resource(planet.getResource(Math.random()), 50, point.x, point.y, planet);
            aux.sprite.anchor.setTo(0.5, 0.9);
            aux.sprite.rotation = game.physics.arcade.angleBetween(aux, planet) - Math.PI/2;
        }
        else {
            point = planet.circle.circumferencePoint(360/slots * i, true);
            aux = new Pylon.Spaceship(game, point.x, point.y);
            aux.body.rotation = game.physics.arcade.angleBetween(aux, planet) - Math.PI/2;
            aux.body.setCollisionGroup(Py.spaceshipCollisionGroup);
            game.add.existing(aux);
            Py.spaceshipGroup.add(aux);
            Py.s = aux; //TEMP for debuggin purposes
        }
    }   
    this.slots = slots;
}

Pylon.Planet.prototype.showSlotsToBuild = function() {
    var aux, point,
        i = 0;
    
    for(i = 0; i < this.slots; i++) {
        point = this.circle.circumferencePoint(360/this.slots * i, true);
        //TEMP 50 as resource quantity
        aux = new Pylon.PlanetSlotMenu(point.x, point.y);
        aux.anchor.setTo(0.5, 0.9);
        aux.rotation = game.physics.arcade.angleBetween(aux, this) - Math.PI/2;
        game.add.existing(aux);
        this.slotsToBuild.add(aux);
    }
}

Pylon.Planet.prototype.hideSlotsToBuild = function() {
    var i = 0;
    this.slotsToBuild.removeAll(true);//calling destroy on every child
}

