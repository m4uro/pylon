Pylon.Planet = function (x, y, radius, bsu) {
    this.bsu = bsu || 60;
    this.resourceMap = {
        mineral: 0.5,
        wood: 0.5
    };
    this.circle = new Phaser.Circle(x, y, radius);
    this.x = x;
    this.y = y;
    this.radius = radius;
};

Pylon.Planet.prototype = {
    getResource: function (rnd) {
        var number = 0;
        for (res in this.resourceMap) {
            if (typeof this.resourceMap[res] !== 'function') {
                number += this.resourceMap[res];
                if (rnd < number) return res;
            }
        }
    }
};

Pylon.Planet.prototype.constructor = Pylon.Planet;