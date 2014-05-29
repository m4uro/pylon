var game = new Phaser.Game(1368, 656, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.atlas('scooby', 'assets/scooby.png', 'assets/scooby.json');
    game.load.atlas('scooby2', 'assets/scooby2.png', 'assets/scooby2.json');
    game.load.atlas('scooshy', 'assets/scooshy.png', 'assets/scooshy.json');
    game.load.atlas('scooshy2', 'assets/scooshy2.png', 'assets/scooshy2.json');
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
//    createPlanets(7);
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
    
    Py.EvilScooby = new Pylon.Character(game, 100, 380, 'M');

    game.add.existing(Py.EvilScooby);
    
    Py.scooby = new Pylon.Character(game, 100, 380, 'M', '2');

    game.add.existing(Py.scooby);
    
    Py.scooshy = new Pylon.Character(game, 200, 380, 'F', '2');

    game.add.existing(Py.scooshy);
    
    Py.messageCount = 0;
    
    game.input.mouse.mouseDownCallback = mouseClick;
    
}


/**
 * World and camera settings
 *
**/
function setWorld() {
    //  Modify the world and camera bounds
    game.world.setBounds(0, 0, 4000, 4000);
    var canvas = window.document.getElementsByTagName('canvas')[0],
        prevX = 0, prevY = 0, mouseDown = false,
        counterVel = 0.005,
        trackedTimes = [],
        backTimeToInertia = 10;
    function onMouseTouchUp(e){
        if(trackedTimes.length > backTimeToInertia){
            var initTime = trackedTimes[trackedTimes.length - 1],
                lastTime = trackedTimes[trackedTimes.length - backTimeToInertia],
                deltaTime = Date.now() - lastTime.time;
                Vix = (lastTime.x - initTime.x) / (deltaTime),
                Viy = (lastTime.y - initTime.y) / (deltaTime),
                t = 25,
                deltaTimeMin = 100,
                inertia = null;
            console.log(Date.now()+ 'out');
            console.log(lastTime.time +'-'+ initTime.time + '=' + deltaTime);
            if(deltaTime < deltaTimeMin) {
                inertia = setInterval(function(){
                    game.camera.x += (Vix * t) - (counterVel * (Math.log(t)));
                    game.camera.y += (Viy * t) - (counterVel * (Math.log(t)));
                    t -= 1;
                    if(t <= 1) {
                        clearInterval(inertia);
                    }
                }, 10);                
            }
        }
        trackedTimes = [];
        mouseDown = false;
    }
    
    canvas.addEventListener('touchstart',function(e){
        prevX = e.changedTouches[0].screenX;
        prevY = e.changedTouches[0].screenY;
    });
    
    canvas.addEventListener('mousedown',function(e){
        if (e.which === 1) {
            mouseDown = true;
        }
        prevX = e.screenX;
        prevY = e.screenY;
    });
    
    canvas.addEventListener('touchmove',function(e){
        e.preventDefault();
        game.camera.x+= prevX - e.changedTouches[0].screenX;
        prevX = e.changedTouches[0].screenX;
        game.camera.y+= prevY - e.changedTouches[0].screenY;
        prevY = e.changedTouches[0].screenY;
        trackedTimes.push({
            time: Date.now(),
            x: prevX,
            y: prevY
        });
    });
    
    canvas.addEventListener('mousemove',function(e){
        if(mouseDown){
            e.preventDefault();
            game.camera.x+= prevX - e.screenX;
            prevX = e.screenX;
            game.camera.y+= prevY - e.screenY;
            prevY = e.screenY;
            trackedTimes.push({
                time: Date.now(),
                x: prevX,
                y: prevY
            });
            console.log(Date.now());
        }
    });
    
    canvas.addEventListener('mouseup', onMouseTouchUp);
    
    canvas.addEventListener('mouseleave',onMouseTouchUp);
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
    var p, alpha, beta, right, sel;
    sel = Py.selected;
    if ((event.which === 3)&&(sel)) {
        p = new Phaser.Point(event.clientX + game.camera.x, event.clientY + game.camera.y);
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

        if (sel.targetRep) {
            sel.targetRep.cancelActions();
            sel.targetRep.play('idle');
        }
        sel.cancelActions();
        sel.targetAngle = alpha;
        sel.play('walk');

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
//        game.debug.pixel(planet.x, planet.y);
    }

    game.debug.text(Py.messageCount + ': ' +Py.message, 32, 32);
}