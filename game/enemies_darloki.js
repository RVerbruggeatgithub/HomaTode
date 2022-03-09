class Darloki extends Enemy {
//{'class': 'Boss', 'Description' : 'Darloki has high armor and recovers health over time.', 'hp' : 50000, 'speed' : 160, 'armor' : 100, 'color': "#c0ffee", 'size' : 80, 'attraction' : 300, 'value' : 1000, 'tile' : {x: 0,y: 0}, 'lives': 10,'abilities' : [{"ability" : "Heal", "value" : 250, "frequency" : 700}]}

	constructor() {
		super(); 
		this.size = 80; //radius
		this.x = 0; //x locatin
		this.y = 0; //y_location
		this.x_adj = 0
		this.y_adj = 0;
		this.hp = 30000;
		this.armor = 150;
		this.speed = 15; //lower is faster
		this.max_speed = 50;
		this.segment_start_time = 50;
		this.segment = 0;
		this.value = 800;
		this.max_hp = 50000;
		this.color = "#c0ffee";
		this.mytimer = null;
		this.tile_direction = []
		this.tile_sequence = 0;
		this.heal = 250;
		this.lives = 10;
		this.healtimer = null
		this.heal_frequency = 700;
		this.path = null;
		this.tile = {x: -432,y: 0}; //image offset
		this.name = "Darloki";
		this.description = "3-star General of the Azarian empire. Moves slow but extremely difficult to kill due to it's inate healing ability"
		this.special_1 = "Recovers <span style='color:green'>0.7% HP per second</span> of full HP <br />";
		this.special_2 = "Darloki Armor, any damage below  <span style='color:green'>"+this.armor +"</span> gets obsorbed";
	}

	create() {
		var scale = Math.round((this.size / 48) * 100) / 100;
		var resize = this.size / scale;
		var hp_bar = "<div class='hpbar_holder'><div class='hp-bar'><span class='hp-bar-fill' style='width: 100%;'></span></div></div>"	
		var $div = $("<div id='"+this.id+"' class='unit' style='background-image: url(images/aliens.png);  position:absolute;left: "+this.x+";top: "+this.y+"'>"+hp_bar+"</div>").css({
			"-moz-transform": "scale("+scale+", "+scale+")", 
			"transform" : "scale("+scale+", "+scale+")",
			"height" : resize,
			"width" : resize,
			"background-position-x": this.tile_direction["down"][0].x,
			"background-position-y": this.tile_direction["down"][0].y,
			
			})
		$(document.body).append($div)
		
		this.ability_heal();
	}	
	
	ability_heal(){
		this.heal_self(this.heal, this.heal_frequency)
	}
	
		
	heal_self(value, frequency) {
		
		this.healtimer = new Timer(() => {	
			if (!global_pause) {
				this.update_hp(value*-1)
			}
			this.ability_heal()
		}, frequency);

		
	}
	
	remove() {
		try {
			this.healtimer.stop();
		}
		catch (error) {
			if (debug) {
				console.log(error)
			}
		}
		delete units[this.id];
		$("#"+this.id).remove();
		update_gui();
	}
	
}