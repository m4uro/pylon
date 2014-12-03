var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });


function preload() {
    game.load.atlas('scoobyTeam1', 'assets/scoobyTeam1.png', 'assets/scoobyTeam1.json');
    game.load.atlas('scoobyTeam2', 'assets/scoobyTeam2.png', 'assets/scoobyTeam2.json');
    game.load.atlas('scooshyTeam1', 'assets/scooshyTeam1.png', 'assets/scooshyTeam1.json');
    game.load.atlas('scooshyTeam2', 'assets/scooshyTeam2.png', 'assets/scooshyTeam2.json');
    
    game.load.atlas('icons', 'assets/icons.png', 'assets/icons.json');
    game.load.atlas('buildings', 'assets/buildings.png', 'assets/buildings.json');
    
    
    game.load.image('red', 'assets/red.png');
    game.load.image('slot', 'assets/slot.png');
    game.load.image('planet1', 'assets/planet1.png');
    game.load.image('mineral', 'assets/mineral.png');
    game.load.image('wood', 'assets/wood.png');
    game.load.image('spaceship', 'assets/spaceship.png');
    game.load.image('building', 'assets/building.png');
    game.load.image('viewport', 'assets/viewport.png');
    game.load.image('minimap', 'assets/minimap.png');

    game.load.image('constructorIcon', 'assets/mineral.png');//TODO change the sprite
    
    
    game.load.bitmapFont('eurostyle', 'assets/eurostyle_0.png', 'assets/eurostyle.xml');
    game.load.bitmapFont('euroObl', 'assets/euroObl_0.png', 'assets/euroObl.xml');

    //TODO see where we'll put the pixi filters
    game.load.script('abstracFilter', 'src/pixi/filters/AbstractFilter.js');
    game.load.script('pixelFilter', 'src/pixi/filters/PixelateFilter.js');
}

function create() {
    var i, j, planet, aux;
//    Py.BSU = 80; //Basic Slot Unit
    Py.camera = new Pylon.Camera(game);
    Py.minimap = new Pylon.MiniMap(game);    
    Py.menu = new Pylon.Menu(game);
    Py.topI = new Pylon.TopInterface(game);
    
//    game.physics.startSystem(Phaser.Physics.ARCADE); //arcade
//    game.physics.startSystem(Phaser.Physics.NINJA);//ninja
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.applyDamping = false;
    game.physics.p2.restitution = 0.1;
    
    game.physics.p2.setImpactEvents(true);
    Py.spaceshipCollisionGroup = game.physics.p2.createCollisionGroup();
    Py.planetCollisionGroup = game.physics.p2.createCollisionGroup();
//    game.physics.ninja.gravity = 0;

    Py.attr = {
        angularSpeed: 0.7,
        extraction: 10
    };
    
//    Py.red = game.add.sprite(250, 250, 'red');
    
//    Py.planet1sprite = game.add.sprite(250, 250, 'planet1');
//    Py.planet1sprite.anchor.setTo(0.5, 0.5);
//    Py.planet1sprite.scale.setTo(1.5,1.4);
    Py.planetGroup = game.add.group();
    Py.spaceshipGroup = game.add.group();
    Py.buildingGroup = game.add.group();
    Py.planets = new Array();

    createPlanets(7);
//    Py.planets.push(new Pylon.Planet(250, 250, 100));
//    Py.planets.push(new Pylon.Planet(600, 200, 60));
//    Py.planets.push(new Pylon.Planet(1000, 300, 130));

    game.stage.backgroundColor = 0x02B5F0;
    
    
    for (j = 0; j < Py.planets.length; j++) {
        planet = Py.planets[j];
        aux = game.add.existing(planet);
        aux.body.setCollisionGroup(Py.planetCollisionGroup);
        aux.body.collides(Py.spaceshipCollisionGroup);
        Py.planetGroup.add(aux);
        planet.setSlots();
    }
    Py.s.tint = 0x000000; //TEMP for debuggin purposes
    
    Py.EvilScooby = new Pylon.Character(game, 100, 380, 'M', 'Team2');

    game.add.existing(Py.EvilScooby);
    
    Py.scooby = new Pylon.Character(game, 100, 380, 'M', 'Team1');

    game.add.existing(Py.scooby);   
    
    Py.scooshy = new Pylon.Character(game, 200, 380, 'F', 'Team1');

    game.add.existing(Py.scooshy);
    
    Py.messageCount = 0;
    Py.message = new Array();
    game.input.mouse.mouseDownCallback = mouseClick;
    
    Py.minimap.updateZ();//TODO this should be done when we finish adding new stuff
    
    aux = game.input.keyboard.addKey(Phaser.Keyboard.B);
    aux.onDown.add(Py.menu.clickHammer, this);
    
    Py.messages = new Pylon.Messages(game);
    aux = game.input.keyboard.addKey(Phaser.Keyboard.M);
    aux.onDown.add(Py.messages.newMessage, Py.messages);
    
    Py.messages.newMessage('hello');
    
// TODO Delete - Trying to find an easy way to click the background with priority
//    aux = game.add.sprite( 100, 100, 'icons', 'ok0000');
//    aux.inputEnabled = true;
//    aux.input.enableDrag();
//    aux.input.priorityID = 2;
////    aux.input.pixelPerfectClick = true;
//    aux.events.onInputDown.add(function () {
//        Py.messages.newMessage('ok');
//    }, this);
//    
//    aux = game.add.sprite( 100, 120, 'icons', 'tower0000');
//    aux.inputEnabled = true;
//    aux.input.enableDrag();
//    aux.input.priorityID = 1;
////    aux.input.pixelPerfectClick = true;
//    aux.events.onInputDown.add(function () {
//        Py.messages.newMessage('tower');
//    }, this);
    
    
    
}


function update() {
    //minimap.renderXY(worldGroup, 200, 150, true);
}

function createPlanets(number) {
    var count, i, j, point, newRadius, tooClose, D, newX, newY, d;
    count = number || 3;
    D = 300;
    for (i = 0; i< count; i++) {
        newRadius = Math.floor(Math.random() * 100) + 50; //100 < newRadius < 300
        do {
            tooClose = false;
            newX = game.world.centerX + Math.random() * D * Math.cos(game.rnd.angle());
            newY = game.world.centerY + Math.random() * D * Math.sin(game.rnd.angle());
            point = new Phaser.Point(newX, newY);
            //check for distance with the previous planets 
            for (j = 0 ; j < i ; j++) {
                d = game.physics.arcade.distanceBetween(Py.planets[j], point) - Py.planets[j].radius - newRadius;
                //distancebetween current planet and random position - rcurrent - rgenerated
                if (d <= D/2) { //TODO the comparison parameter could be refined
                    tooClose = true;
                    break;
                }
            }
        }
        while(tooClose);
        Py.planets.push(new Pylon.Planet(newX, newY, newRadius));
        D = 300 + (100 * i);
    }
}

function mouseClick(event) {
    var p;
//    Py.messages.newMessage('general');
    if ((event.which === 3)&&(Py.selected)) {
        p = new Phaser.Point(event.clientX + game.camera.x, event.clientY + game.camera.y);
        Py.selected.walkTo(p);
    }
    p = new Phaser.Point(event.clientX + game.camera.x, event.clientY + game.camera.y);
//    Py.messages.newMessage('' + Phaser.Math.radToDeg(game.physics.arcade.angleBetween(p, Py.planets[0]) + Math.PI));
    //TEMP for debugging:
//    p = new Phaser.Point(event.clientX + game.camera.x, event.clientY + game.camera.y);
//    var i, Fx, Fy, alpha, aux, r, Fxf, Fyf;
//    Py.message = new Array();
//    Py.message[0] = '';
//    Fxf = 0;
//    Fyf = 0;
//    for (i = 0; i < Py.planets.length; i++) {
//        r = game.physics.arcade.distanceBetween(p, Py.planets[i]);
//        Py.message[0] += '' + r;
//        Py.message[0] += ' ';
//        
//        alpha = game.physics.arcade.angleBetween(p, Py.planets[i]);
//        aux = Py.planets[i].mass/(r * r)
//        Fx = aux * Math.cos(alpha);
//        Fy = aux * Math.sin(alpha);
//        Py.message.push('alpha:'+alpha+', Fx'+i+':'+Fx+', Fy'+i+':'+Fy);
//        Fxf += Fx;
//        Fyf += Fy;
//    }
//    Py.message.push('Fxf:'+Fxf+', Fyf:'+Fyf);
}


function render() {

    var i, j, point;
    for (j = 0; j < Py.planets.length; j++) {
        var planet = Py.planets[j];
//        game.debug.geom(planet.circle,'rgba(255,127,39,0.3)');
        var slots = Math.floor(planet.circle.circumference() / planet.bsu);
//        for (i = 0; i < slots; i++) {
//            console.log(i);
//            point = planet.circle.circumferencePoint(360/slots * i, true);
//            game.debug.pixel(point.x, point.y);
//        }
//        game.debug.pixel(planet.x, planet.y);
    }
    for (i = 0; i < Py.message.length; i++) {
        //  game.debug.text(Py.messageCount + ': ' +Py.message[i], 32, 32 * (i+1));
    }
    
//    Py.planetGroup.forEach(function(item) {
//        game.debug.body(item);
//    });
//    Py.spaceshipGroup.forEach(function(item) {
//        game.debug.body(item);
//        game.debug.pixel(item.x, item.y);
//    });
}