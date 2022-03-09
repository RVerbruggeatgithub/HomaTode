class Taxi extends Enemy {

	constructor() {
		super(); 
		this.size = 30; //radius
		this.x = 0; //x locatin
		this.y = 0; //y_location
		this.x_adj = 0
		this.y_adj = 0;
		this.hp = 250;
		this.armor = 40;
		this.speed = 55; //lower is faster
		this.max_speed = 55;
		this.segment_start_time = 50;
		this.segment = 0;
		this.value = 6;
		this.max_hp = 250;
		this.color = "#c0ffee";
		this.mytimer = null;
		this.tile_direction = []
		this.tile_sequence = 0;
		this.heal = 250;
		this.lives = 10;
		this.healtimer = null
		this.heal_frequency = 2000;
		this.path = null;
		this.tile = {x: -290,y: -192}; //image offset
		this.name = "Taxi";
		this.description = "Taxi'an empirical elite figher. Low health but recovers full health rapidly."
		this.special_1 = "Recovers <span style='color:green'>100% HP per 2 seconds</span> of full HP <br />";
		this.special_2 = "Taxi'an speed amplifier drug, this is a <span style='color:green'>very fast</span> unit";
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