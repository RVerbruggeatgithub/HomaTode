class Azaries extends Enemy {
//['Azaries', {'class': 'I', 'Description' : 'unknown','hp' : 180, 'speed' : 100, 'armor' : 0, 'color': "#dadd33", 'size' : 20, 'attraction' : 500, 'value' : 1, 'tile' : {x: -432,y: 0}, 'lives': 1, 'abilities' : [{"ability" : "Unfocus", "value" : 250, "frequency" : 700}] }]
//rename attraction to spread.

	constructor() {
		super(); 
		this.size = 20; //radius
		this.x = 0; //x locatin
		this.y = 0; //y_location
		this.x_adj = 0
		this.y_adj = 0;
		this.hp = 80;
		this.armor = 0;
		this.speed = 50; //higher is faster
		this.max_speed = 55;
		this.segment_start_time = 50;
		this.segment = 0;
		this.value = 1;
		this.max_hp = 180;
		this.color = "#dadd33";
		this.mytimer = null;
		this.tile_direction = []
		this.tile_sequence = 0;
		this.abilities = [{"ability" : "Unfocus", "value" : 250, "frequency" : 700}]
		this.heal = 0;
		this.lives = 1;
		this.heal_frequency = 0;
		this.path = null;
		this.tile = {x: -432,y: 0}; //image offset
		this.name = "Azarie";
		this.description = "Lowest scum of the Azarian empire, often comes in bunches."
		this.special_1 = "";
		this.special_2 = "";
	}


}