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
		buildings: [{
			icon: 'red',
			toBuild: 'tower'
		},{
			icon: 'red',
			toBuild: 'house'
		}]		
	},
	Team2: {
		buildings: [{
			icon: 'red',
			toBuild: 'tower'
		}]		
	}
};
