class Rasmori extends Enemy {
//['Azaries', {'class': 'I', 'Description' : 'unknown','hp' : 180, 'speed' : 100, 'armor' : 0, 'color': "#dadd33", 'size' : 20, 'attraction' : 500, 'value' : 1, 'tile' : {x: -432,y: 0}, 'lives': 1, 'abilities' : [{"ability" : "Unfocus", "value" : 250, "frequency" : 700}] }]
//rename attraction to spread.

	constructor() {
		super(); 
		this.size = 25; //radius
		this.x = 0; //x locatin
		this.y = 0; //y_location
		this.x_adj = 0
		this.y_adj = 0;
		this.hp = 500;
		this.armor = 50;
		this.speed = 35; //lower is faster
		this.max_speed = 50;
		this.segment_start_time = 50;
		this.segment = 0;
		this.value = 5;
		this.max_hp = 500;
		this.color = "#dadd33";
		this.mytimer = null;
		this.tile_direction = []
		this.tile_sequence = 0;
		this.abilities = []
		this.heal = 0;
		this.lives = 2;
		this.heal_frequency = 0;
		this.path = null;
		this.tile = {x: 0,y: -194}; //image offset
		this.name = "Gurhab";
		this.description = "2-star ranking soldier in the Delzoun warfleet, relatively well armoured."
		this.special_1 = "";
		this.special_2 = "";
	}


}