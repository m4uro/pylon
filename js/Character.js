Pylon.Character = function (game, x, y, key) {

    Phaser.Sprite.call(this, game, x, y, key);
};

Pylon.Character.prototype = Object.create(Phaser.Sprite.prototype);
Pylon.Character.prototype.constructor = Pylon.Character;

Pylon.Character.prototype.init = function () {
    this.anchor.setTo(0.5, 0.88);
    this.scale.setTo(0.7, 0.7);
    this.play('idle');
    this.planet = game.rnd.pick(Py.planets);
    this.targetResource = null;
    this.busy = false;
    this.angularSpeed = 0;
    this.currentAngle = Math.floor(Math.random()*360);
    this.inputEnabled = true;
    this.input.pixelPerfectClick = true;
    this.events.onInputDown.add(this.clicked, this);
};

Pylon.Character.prototype.update = function () {
    var aux, offset, currentAngle;
    offset = 0.01;
    currentAngle = game.physics.arcade.angleBetween(this, this.planet) + Math.PI;
    if ((currentAngle > this.targetAngle - offset) && (currentAngle < this.targetAngle + offset)) {
        this.angularSpeed = 0;
        if (this.targetRes) {
            this.play('gather');
            //set timer and extract
            if (!this.busy) {
                this.busy = true;
                //TEMP Py.timer
                this.timer = game.time.events.add(Phaser.Timer.SECOND * 1, function () { 
                    aux = this.targetRes.extract(Py.attr.extraction);
                    Py.message = 'Extracted ' + aux + ' ' + this.targetRes.type + '!';
                    Py.messageCount++;
                    if (this.targetRes.qty === 0) {
                        this.play('idle');
                        this.targetRes = null;
                    }
                    this.busy = false;
                }, this);
            }
        }
        else {
            this.play('idle');
        }
    }
    if (this.animations.currentAnim.name == 'walk') {
        this.currentAngle += this.angularSpeed;
    }
    aux = this.planet.circle.circumferencePoint(this.currentAngle, true);
    this.x = aux.x;
    this.y = aux.y;
    this.rotation = game.physics.arcade.angleBetween(this, this.planet) - Math.PI/2;
};

Pylon.Character.prototype.clicked = function clicked(sprite, pointer) {
    //pointer: left, middle, right / 0, 1, 2
    console.log('You clicked ' + sprite.key);
    if (pointer.button === 0) {
        Py.selected = this;
    }
};