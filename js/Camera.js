Pylon.Camera = function(game){
    this.game = game;  
    this.constructor();
};

Pylon.Camera.prototype.move = function(deltaX, deltaY) {
    this.game.camera.x += deltaX;
    this.game.camera.y += deltaY;
    Py.minimap.updateViewport(this.game.camera.x, this.game.camera.y);
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
    this.game.world.setBounds(0, 0, Py.worldBounds.width, Py.worldBounds.height);
    var canvas = window.document.getElementsByTagName('canvas')[0],
        prevX = 0, prevY = 0, mouseDown = false;
    
    canvas.addEventListener('touchstart',function(e){
        prevX = e.changedTouches[0].screenX;
        prevY = e.changedTouches[0].screenY;
    });
    
    canvas.addEventListener('mousedown',function(e){
        mouseDown = true;     
        prevX = e.clientX;
        prevY = e.clientY;
    });
    
    canvas.addEventListener('touchmove',function(e){
        e.preventDefault();
        if(Py.minimap.mouseDown) {
            Py.minimap.onOverMinimap({ x: prevX - e.changedTouches[0].screenX, y: prevY - e.changedTouches[0].screenY});
        }else {
            self.move(prevX - e.changedTouches[0].screenX, prevY - e.changedTouches[0].screenY);    
        }        
        prevX = e.changedTouches[0].screenX;
        prevY = e.changedTouches[0].screenY;
    });
    
    canvas.addEventListener('mousemove',function(e){
        if(mouseDown){
            e.preventDefault();
            if(Py.minimap.mouseDown) {
                Py.minimap.onOverMinimap({ x: e.clientX, y: e.clientY});
            }else {
                self.move(prevX - e.clientX, prevY - e.clientY);
            }            
            prevX = e.clientX;
            prevY = e.clientY;
        }
    });
    
    canvas.addEventListener('mouseup',function(e){
        mouseDown = false;

    });
    
    canvas.addEventListener('mouseleave',function(e){
        mouseDown = false;
    });
    
    window.onresize = this.onWindowResize;
}

Pylon.Camera.prototype.onWindowResize = function(e) {
    this.game.width = window.innerWidth;
    this.game.height = window.innerHeight;
    this.game.setUpRenderer();
    Py.minimap.setSizeAndPosition();
    Py.minimap.updateZ();
}