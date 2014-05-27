Pylon.Character = function (game, x, y, gender) {
    if (!gender) gender = game.rnd.pick(['M','F']);
    if (gender === 'M') {
        Phaser.Sprite.call(this, game, x, y, 'scooby');
        this.animations.add('idle', Phaser.Animation.generateFrameNames('Scooby', 0, 30, '', 4), 30, true, false);
        this.animations.add('walk', Phaser.Animation.generateFrameNames('Scooby', 31, 60, '', 4), 30, true, false);
        this.animations.add('gather', Phaser.Animation.generateFrameNames('Scooby', 61, 90, '', 4), 30, true, false);
        this.animations.add('select', Phaser.Animation.generateFrameNames('Scooby', 91, 99, '', 4), 30, true, false);
        this.animations.add('fuck', Phaser.Animation.generateFrameNames('Scooby', 100, 122, '', 4), 30, true, false);
        this.animations.add('fight', Phaser.Animation.generateFrameNames('Scooby', 123, 152, '', 4), 30, true, false);
    }
    else if (gender === 'F') {
        Phaser.Sprite.call(this, game, x, y, 'scooshy');
        this.animations.add('idle', Phaser.Animation.generateFrameNames('Scooshy', 0, 30, '', 4), 30, true, false);
        this.animations.add('walk', Phaser.Animation.generateFrameNames('Scooshy', 31, 60, '', 4), 30, true, false);
        this.animations.add('gather', Phaser.Animation.generateFrameNames('Scooshy', 61, 90, '', 4), 30, true, false);
        this.animations.add('select', Phaser.Animation.generateFrameNames('Scooshy', 91, 99, '', 4), 30, true, false);
        this.animations.add('fuck', Phaser.Animation.generateFrameNames('Scooshy', 100, 117, '', 4), 30, true, false);
        this.animations.add('fight', Phaser.Animation.generateFrameNames('Scooshy', 118, 147, '', 4), 30, true, false);
        this.animations.add('birth', Phaser.Animation.generateFrameNames('Scooshy', 148, 183, '', 4), 30, true, false);
    }
    else console.log('Error: invalid gender specified in character creation');
    this.anchor.setTo(0.5, 0.88);
    this.scale.setTo(0.7, 0.7);
    this.gender = gender;
    this.play('idle');
    //this.planet = game.rnd.pick(Py.planets);
    this.planet = Py.planets[2];
    this.targetResource = null;
    this.busy = false;
    this.angularSpeed = 0;
    this.currentAngle = Math.floor(Math.random()*360);
    this.inputEnabled = true;
    this.input.pixelPerfectClick = true;
    this.events.onInputDown.add(this.clicked, this);
    this.offset = 0.01;
};

Pylon.Character.prototype = Object.create(Phaser.Sprite.prototype);
Pylon.Character.prototype.constructor = Pylon.Character;

Pylon.Character.prototype.update = function () {
    var aux, offset, currentAngle, cAnim, male, female, newChar;
    currentAngle = game.physics.arcade.angleBetween(this, this.planet) + Math.PI;
    if ((currentAngle > this.targetAngle - this.offset) && (currentAngle < this.targetAngle + this.offset)) {
        this.angularSpeed = 0;
        
        if (this.targetRes) {
            this.play('gather');
            //set timer and extract
            if (!this.busy) {
                this.busy = true;
                this.timer = game.time.events.add(Phaser.Timer.SECOND * 1, function () { 
                    aux = this.targetRes.extract(Py.attr.extraction);
                    Py.message = 'Extracted ' + aux + ' ' + this.targetRes.type + '!';
                    Py.messageCount++;
                    if (this.targetRes.qty === 0) {
                        this.play('idle');
                        this.targetRes = null;
//                        this.targetAngle = null;
                    }
                    this.busy = false;
                }, this);
            }
        }
        else if (this.targetRep) {
            this.play('fuck');
            this.targetRep.cancelActions();
            if (this.targetRep.scale.x - this.scale.x !== 0) this.targetRep.scale.x *= -1;
            this.targetRep.play('fuck');
        
            if (!this.timer) {
                this.timer = game.time.events.add(Phaser.Timer.SECOND * 2, function () { 
                    if (this.gender === 'M') {
                        male = this;
                        female = this.targetRep;
                    }
                    else {
                        male = this.targetRep;
                        female = this;
                    }
                    male.play('idle');
                    this.targetRep = null;
                    female.play('birth', null, false);
                }, this);
            }
        }
        else {
            this.play('idle');
        }
    }
    cAnim = this.animations.currentAnim;
    switch(cAnim.name) {
            case 'walk': 
                this.currentAngle += this.angularSpeed;
                break;
            case 'select':
                if (cAnim.isFinished) this.play('idle');
                break;
            case 'birth':
                if (cAnim.isFinished) {
                    newChar = game.add.existing(new Pylon.Character(game, this.x, this.y, game.rnd.pick(['M','F'])));
                    newChar.currentAngle = this.currentAngle;
                    newChar.scale.setTo(0.4, 0.4);
                    if (this.scale.x > 0) {
                        game.add.tween(newChar).to({currentAngle: this.currentAngle + 20}, 500, Phaser.Easing.Bounce.Out, true, 0, false);
                    }
                    else {
                        game.add.tween(newChar).to({currentAngle: this.currentAngle - 20}, 500, Phaser.Easing.Bounce.Out, true, 0, false);
                    }
                    game.add.tween(newChar).to({angle: 360}, 1500, Phaser.Easing.Linear.None, true, 0, false);
                    game.add.tween(newChar.scale).to({x: 0.7, y: 0.7}, 2400, Phaser.Easing.Quadratic.In, true, 0, false);
                    this.play('idle');
                }
    }

    aux = this.planet.circle.circumferencePoint(this.currentAngle, true);
    this.x = aux.x;
    this.y = aux.y;
    this.rotation = game.physics.arcade.angleBetween(this, this.planet) - Math.PI/2;
};

Pylon.Character.prototype.clicked = function (sprite, pointer) {
    //pointer: left, middle, right / 0, 1, 2
    console.log('You clicked ' + sprite.key);
    if (pointer.button === 0) {
        Py.selected = this;
        this.play('select', null, false);
        this.targetAngle = null;
    }
    else if ((pointer.button === 2)&&(this.gender === 'F')&&(Py.selected)&&(Py.selected.gender === 'M')&&(Py.selected.planet === this.planet)) {
        //right click on a character of different gender in the same planet
        //TODO only friendly units should be allowed
        Py.selected.targetRep = this;
        Py.selected.offset = 0.15; //offset is modified to avoid sprite overlapping
    }
};

Pylon.Character.prototype.cancelActions = function () {
    this.busy = false;
    this.targetRes = null;
    this.targetRep = null;
    if (this.timer) {
        game.time.events.remove(this.timer);
        this.timer = null;
    }
    this.targetAngle = null;
    this.offset = 0.01;
};