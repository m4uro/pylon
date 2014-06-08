Pylon.Camera = function(game){
    this.game = game;  
    this.constructor();
};

Pylon.Camera.prototype.move = function(deltaX, deltaY) {
    this.game.camera.x += deltaX;
    this.game.camera.y += deltaY;
    minimap.updateViewport(this.game.camera.x, this.game.camera.y);
}

Pylon.Camera.prototype.absoluteMove = function(x, y) {
    this.move(x - this.game.camera.x, y - this.game.camera.y);
}
/**
 * World and camera settings
 *
**/
Pylon.Camera.prototype.constructor = function(){
    var self = this;
    //  Modify the world and camera bounds
    this.game.world.setBounds(0, 0, worldBounds.width, worldBounds.height);
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
                deltaTimeMin = 200,
                inertia = null;
            
            if(deltaTime < deltaTimeMin) {
                inertia = setInterval(function(){
                    self.move( (Vix * t) - (counterVel * (Math.log(t))), (Viy * t) - (counterVel * (Math.log(t))) );
                    
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
        self.move(prevX - e.changedTouches[0].screenX, prevY - e.changedTouches[0].screenY);
        prevX = e.changedTouches[0].screenX;
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
            self.move( prevX - e.screenX, prevY - e.screenY);
            prevX = e.screenX;
            prevY = e.screenY;
            
            trackedTimes.push({
                time: Date.now(),
                x: prevX,
                y: prevY
            });
        }
    });
    
    canvas.addEventListener('mouseup', onMouseTouchUp);
    
    canvas.addEventListener('mouseleave',onMouseTouchUp);
}

