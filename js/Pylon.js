var Pylon = {};
var Py = {
	camera: null,
	minimap: null,
	menu: null,
	worldBounds: { width: 4000, height: 4000},
	currentCharacterId: 0//every character to create will need an id.
};
var GameSettings = {
	Team1: {
		resources: {
            mineral: 0,
            wood: 0
        }
        ,
        buildings: [{
			icon: 'tower',
			toBuild: 'tower',
            cost: {
                mineral: 40,
                wood: 40
            }
		},{
			icon: 'factory',
			toBuild: 'factory',
            cost: {
                wood: 60
            }
		},{
			icon: 'spaceship',
			toBuild: 'spaceship',
            cost: {
                mineral: 50
            }
		},{
			icon: 'academy',
			toBuild: 'academy',
            cost: {
                mineral: 20,
                wood: 30
            }
		}]				
	},
	Team2: {
        resources: {
            mineral: 0,
            wood: 0
        },
		buildings: [{
			icon: 'tower',
			toBuild: 'tower',
            cost: {
                mineral: 40,
                wood: 40
            }
		},{
			icon: 'factory',
			toBuild: 'factory',
            cost: {
                wood: 60
            }
		},{
			icon: 'spaceship',
			toBuild: 'spaceship',
            cost: {
                mineral: 50
            }
		},{
			icon: 'academy',
			toBuild: 'academy',
            cost: {
                mineral: 20,
                wood: 30
            }
		}]				
	}
};
