var game = new Phaser.Game(1368, 656, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.atlas('scooby', 'assets/scooby.png', 'assets/scooby.json');
    game.load.atlas('scooshy', 'assets/scooshy.png', 'assets/scooshy.json');
    game.load.image('red', 'assets/red.png');
    game.load.image('planet1', 'assets/planet1.png');
    game.load.image('mineral', 'assets/mineral.png');
    game.load.image('wood', 'assets/wood.png');
    game.load.image('spaceship', 'assets/spaceship.png');
    game.load.image('building', 'assets/building.png');
}

function create() {
    var i, j, point, planet, slots, aux;
//    Py.BSU = 80; //Basic Slot Unit
    setWorld();

    Py.attr = {
        angularSpeed: 0.7,
        extraction: 10
    };
    
    Py.red = game.add.sprite(250, 250, 'red');
//    Py.planet1sprite = game.add.sprite(250, 250, 'planet1');
//    Py.planet1sprite.anchor.setTo(0.5, 0.5);
//    Py.planet1sprite.scale.setTo(1.5,1.4);
    
    Py.planets = new Array();
//    createPlanets(3);
    Py.planets.push(new Pylon.Planet(250, 250, 200));
    Py.planets.push(new Pylon.Planet(600, 200, 120));
    Py.planets.push(new Pylon.Planet(1000, 300, 260));

    game.stage.backgroundColor = 0x02B5F0;
    
    
    for (j = 0; j < Py.planets.length; j++) {
        planet = Py.planets[j];
        slots = Math.floor(planet.circle.circumference() / planet.bsu);
        for (i = 0; i < slots; i++) {
            if (Math.random() <= 0.6) {
                point = planet.circle.circumferencePoint(360/slots * i, true);
                //TEMP 50 as resource quantity
                aux = new Pylon.Resource(planet.getResource(Math.random()), 50, point.x, point.y, planet);
                aux.sprite.anchor.setTo(0.5, 0.9);
                aux.sprite.rotation = game.physics.arcade.angleBetween(aux, planet) - Math.PI/2;
            }
        }
    }
    
    Py.scooby = new Pylon.Character(game, 100, 380, 'scooby');
    Py.scooby.animations.add('idle', Phaser.Animation.generateFrameNames('Scooby', 0, 30, '', 4), 30, true, false);
    Py.scooby.animations.add('walk', Phaser.Animation.generateFrameNames('Scooby', 31, 60, '', 4), 30, true, false);
    Py.scooby.animations.add('gather', Phaser.Animation.generateFrameNames('Scooby', 61, 90, '', 4), 30, true, false);
    Py.scooby.animations.add('select', Phaser.Animation.generateFrameNames('Scooby', 91, 99, '', 4), 30, true, false);
    Py.scooby.animations.add('fuck', Phaser.Animation.generateFrameNames('Scooby', 100, 122, '', 4), 30, true, false);
    Py.scooby.animations.add('fight', Phaser.Animation.generateFrameNames('Scooby', 123, 152, '', 4), 30, true, false);
    Py.scooby.init();
    game.add.existing(Py.scooby);
    
    Py.scooshy = new Pylon.Character(game, 200, 380, 'scooshy');
    Py.scooshy.animations.add('idle', Phaser.Animation.generateFrameNames('Scooshy', 0, 30, '', 4), 30, true, false);
    Py.scooshy.animations.add('walk', Phaser.Animation.generateFrameNames('Scooshy', 31, 60, '', 4), 30, true, false);
    Py.scooshy.animations.add('gather', Phaser.Animation.generateFrameNames('Scooshy', 61, 90, '', 4), 30, true, false);
    Py.scooshy.animations.add('select', Phaser.Animation.generateFrameNames('Scooshy', 91, 99, '', 4), 30, true, false);
    Py.scooshy.animations.add('fuck', Phaser.Animation.generateFrameNames('Scooshy', 100, 117, '', 4), 30, true, false);
    Py.scooshy.animations.add('fight', Phaser.Animation.generateFrameNames('Scooshy', 118, 147, '', 4), 30, true, false);
    Py.scooshy.animations.add('birth', Phaser.Animation.generateFrameNames('Scooshy', 148, 183, '', 4), 30, true, false);
    Py.scooshy.init();
    game.add.existing(Py.scooshy);
    
    Py.messageCount = 0;
//    Py.selected = Py.scooby;
    
    game.input.mouse.mouseDownCallback = mouseClick;
    
}

function setWorld() {
    //  Modify the world and camera bounds
    game.world.setBounds(0, 0, 4000, 4000);
    var canvas = window.document.getElementsByTagName('canvas')[0],
        prevX = 0, prevY = 0, mouseDown = false,
        lastTimeTracked = 0,
        backTimeToInertia = 200;
    
    canvas.addEventListener('touchstart',function(e){
        prevX = e.changedTouches[0].screenX;
        prevY = e.changedTouches[0].screenY;
    });
    
    canvas.addEventListener('mousedown',function(e){
        mouseDown = true;
        prevX = e.screenX;
        prevY = e.screenY;
    });
    
    canvas.addEventListener('touchmove',function(e){
        e.preventDefault();
        game.camera.x+= prevX - e.changedTouches[0].screenX;
        prevX = e.changedTouches[0].screenX;
        game.camera.y+= prevY - e.changedTouches[0].screenY;
        prevY = e.changedTouches[0].screenY;
        lastTimeTracked = Date.now();
    });
    
    canvas.addEventListener('mousemove',function(e){
        if(mouseDown){
            e.preventDefault();
            game.camera.x+= prevX - e.screenX;
            prevX = e.screenX;
            game.camera.y+= prevY - e.screenY;
            prevY = e.screenY;
            lastTimeTracked = Date.now();
        }
    });
    
    canvas.addEventListener('mouseup',function(e){
        mouseDown = false;

    });
    
    canvas.addEventListener('mouseleave',function(e){
        mouseDown = false;
    });
}

function update() {

}

function createPlanets(number) {
    var i, j, point, newRadius, tooClose, D, newX, newY, d;
    Py.planetCount = number || 3;
    D = 300;
    for (i = 0; i< Py.planetCount; i++) {
        newRadius = Math.floor(Math.random() * 200) + 100; //100 < newRadius < 300
        do {
            tooClose = false;
            newX = game.world.centerX + Math.random() * D * Math.cos(game.rnd.angle());
            newY = game.world.centerY + Math.random() * D * Math.sin(game.rnd.angle());
            point = new Phaser.Point(newX, newY);
            //check for distance with the previous planets 
            for (j = 0 ; j < i ; j++) {
                d = game.physics.arcade.distanceBetween(Py.planets[j], point) - Py.planets[j].radius - newRadius;
                //distancebetween current planet and random position - rcurrent - rgenerated
                if (d <= D/6) { //TODO the comparison parameter could be refined
                    tooClose = true;
                    break;
                }
            }
        }
        while(tooClose);
        Py.planets.push(new Pylon.Planet(newX, newY, newRadius));
        D = 300 + (200 * i);
    }
}

function mouseClick(event) {
    //TODO: check if character is selected, get character planet
    var p, alpha, beta, right, sel;
    sel = Py.selected;
    if ((event.which === 3)&&(sel)) {
        p = new Phaser.Point(event.clientX, event.clientY);
        alpha = game.physics.arcade.angleBetween(p, sel.planet) + Math.PI; //clicked angle
        beta = game.physics.arcade.angleBetween(sel, sel.planet) + Math.PI; //character angle
        beta = beta % (2*Math.PI);
        
        if (beta >= Math.PI) {
            if ((alpha > beta) || (alpha < ((beta + Math.PI) % (2*Math.PI))))
                right = true;
            else
                right = false;
        }
        else {
            if ((alpha > beta) && (alpha < ((beta + Math.PI) % (2*Math.PI))))
                right = true;
            else
                right = false;
        }
        if (right) {
            sel.angularSpeed = Py.attr.angularSpeed;
            if (sel.scale.x < 0) sel.scale.x *= -1;
        }
        else {
            sel.angularSpeed = -Py.attr.angularSpeed;
            if (sel.scale.x > 0) sel.scale.x *= -1;
        }
        sel.targetAngle = alpha;
        sel.play('walk');
        sel.busy = false;
        sel.targetRes = null;
        if (sel.timer) game.time.events.remove(sel.timer);
    }
}

function render() {

    var i, j, point;
    for (j = 0; j < Py.planets.length; j++) {
        var planet = Py.planets[j];
        game.debug.geom(planet.circle,'rgba(255,127,39,0.3)');
        var slots = Math.floor(planet.circle.circumference() / planet.bsu);
//        for (i = 0; i < slots; i++) {
//            console.log(i);
//            point = planet.circle.circumferencePoint(360/slots * i, true);
//            game.debug.pixel(point.x, point.y);
//        }
        game.debug.pixel(planet.x, planet.y);
    }

    game.debug.text(Py.messageCount + ': ' +Py.message, 32, 32);
}