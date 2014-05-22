Resource = function (type, qty, x, y, planet) {
    this.type = type;
    this.qty = qty;
    this.x = x;
    this.y = y;
    this.sprite = game.add.sprite(x, y, type);
    this.sprite.inputEnabled = true;
    this.sprite.input.pixelPerfectClick = true;
    this.sprite.events.onInputDown.add(clicked, this);
    this.sprite.planet = planet;
    this.sprite.resource = this;
};

Resource.prototype = {
    extract: function (qty) {
        var aux;
        if (qty >= this.qty) {
            this.sprite.destroy();
            this.sprite = null;
            aux = this.qty;
            this.qty = 0;
            return aux;
        }
        else {
            this.qty -= qty;
            return qty;
        }
    }
};

Resource.prototype.constructor = Resource;

function clicked(sprite, pointer) {
    //pointer: left, middle, right / 0, 1, 2
    console.log('You clicked ' + sprite.key);
    if (pointer.button === 2) { //TODO add if character is selected
        //if character planet is the same as the sprite planet
        if (Py.scooby.planet === sprite.planet) {
            //set character to extract this
            Py.scooby.targetResource = sprite.resource;
        }
    }
}