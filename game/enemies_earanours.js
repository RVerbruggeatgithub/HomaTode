class Earanours extends Enemy {
//{'class': 'Boss', 'Description' : 'Darloki has high armor and recovers health over time.', 'hp' : 50000, 'speed' : 160, 'armor' : 100, 'color': "#c0ffee", 'size' : 80, 'attraction' : 300, 'value' : 1000, 'tile' : {x: 0,y: 0}, 'lives': 10,'abilities' : [{"ability" : "Heal", "value" : 250, "frequency" : 700}]}

	constructor() {
		super(); 
		this.size = 50; //radius
		this.x = -144; //x location
		this.y = 0; //y_location
		this.x_adj = 0;
		this.y_adj = 0;
		this.hp = 500;
		this.armor = 10;
		this.speed = 30; //lower is faster
		this.max_speed = 30;
		this.segment_start_time = 50;
		this.segment = 0;
		this.value = 16;
		this.max_hp = 500;
		this.color = "#c0ffee";
		this.mytimer = null;
		this.tile_direction = []
		this.tile_sequence = 0;
		this.heal = 250;
		this.lives = 6;
		this.healtimer = null
		this.heal_frequency = 700;
		this.path = null;
		this.tile = {x: -144,y: 0}; //image offset
		this.name = "Earanours";
		this.spawn_count = 6;
		this._isdead = false;
		this.description = "Relatively weak creature that is used to breed for the Azarian empire. Once destroyed it releases a score of azaries."
		this.special_1 = "<span style='color:green'>Spawns a group of azaries </span>upon death";
		this.special_2 = "";
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
		
	}	
	
	update_hp(hp_mod) {
		if (hp_mod >= 0) {
			hp_mod = hp_mod - this.armor
			hp_mod = hp_mod < 0 ? 0 : hp_mod;
			this.hp -= hp_mod;
		}
		else {
			//unit is healing
			this.hp -= hp_mod;
			if (this.hp > this.max_hp) {
				this.hp = this.max_hp;
			}
		}
					
		var bar_width = (this.hp / this.max_hp) * 30;		
		$("#"+this.id).find("span").css("width", bar_width+"px");
		if (this.hp <= 0 ){			
			Banked += this.value;
			enemies_killed++;
			if (!this._isdead) {
				this._isdead = true;
				this.ability_spawn();
			}
			update_gui();
			this.remove();		
			return true;
		}
		return false
	}
	
	//spawn underling upon death
	ability_spawn(){
		var spawn_location = this.get_location();
		
		for (var n = 0; n < this.spawn_count; n++) {
			var x_adj = getRndInteger(-10, 10);
			var y_adj = getRndInteger(-10, 10);
			var spawn_enemy = new Azaries();
			var tmp_start_locationx = spawn_location.x + x_adj
			var tmp_start_locationy = spawn_location.y + y_adj
			spawn_enemy.construct_unit(generate_unique_id("obj_"), tmp_start_locationx, tmp_start_locationy, x_adj, y_adj); 		
			spawn_enemy.create();
			spawn_enemy.segment = this.segment;			
			units[spawn_enemy.id] = spawn_enemy;
			spawn_enemy.path = this.path;
			spawn_enemy.x = this.x
			spawn_enemy.y = this.y
			spawn_enemy.segment_start_time = this.segment_start_time
			spawn_enemy.run();
		}	
	}

	
	remove() {
		//if there are any attack timers still going this may get triggered more then once. Let's ensure it isn't.

		new Timer(() => {	
			delete units[this.id];
			$("#"+this.id).remove();
			
			update_gui();
		}, 100);

	}
	
}