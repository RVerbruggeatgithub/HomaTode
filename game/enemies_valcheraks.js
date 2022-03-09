class Valcheraks extends Enemy {
//['Azaries', {'class': 'I', 'Description' : 'unknown','hp' : 180, 'speed' : 100, 'armor' : 0, 'color': "#dadd33", 'size' : 20, 'attraction' : 500, 'value' : 1, 'tile' : {x: -432,y: 0}, 'lives': 1, 'abilities' : [{"ability" : "Unfocus", "value" : 250, "frequency" : 700}] }]
//rename attraction to spread.

	constructor() {
		super(); 
		this.size = 50; //radius
		this.x = 0; //x locatin
		this.y = 0; //y_location
		this.x_adj = 0
		this.y_adj = 0;
		this.hp = 450;
		this.armor = 10;
		this.speed = 30; //lower is faster
		this.max_speed = 30;
		this.segment_start_time = 50;
		this.segment = 0;
		this.value = 5;
		this.max_hp = 450;
		this.color = "#dadd33";
		this.mytimer = null;
		this.tile_direction = []
		this.tile_sequence = 0;
		this.abilities = []
		this.heal = 0;
		this.lives = 2;
		this.heal_frequency = 0;
		this.path = null;
		this.tile = {x: -144,y: 0}; //image offset
		this.name = "Valcherak";
		this.description = "Low ranking soldier in the Delzoun Syndicate."
		this.special_1 = "";
		this.special_2 = "";
	}


}