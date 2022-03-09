class Obj {
	constructor() {
		this.id = 0; //rate of fire
		this.size = 0; //radius
		this.x = 0; //x locatin
		this.y = 0; //y_location
		this.x_adj = 0
		this.y_adj = 0;
		this.hp = 0;
		this.armor = 0;
		this.speed = 50; //lower is faster
		this.max_speed = 50;
		this.segment_start_time = 50;
		this.segment = 0;
		this.value = 0;
		this.max_hp = 0;
		this.color = "green";
		this.mytimer = null;
		this.tile_direction = []
		this.tile_sequence = 0;
		this.abilities = []
		this.heal = 0;
		this.lives = 0;
		this.heal_frequency = 0;
	}
	
	construct_unit(x, y, speed, hp, armor, x_adj, y_adj, color, size, value, tile, lives, abilities) {
	//console.log(x, y, $("document").offset());
		var gen_id = "obj_"+getRndInteger(10000, 1000000); 
		this.id = gen_id
		this.size = size; 
		this.hp = hp;
		this.max_hp = hp;
		this.speed = speed;
		this.max_speed = speed;
		this.armor = armor;
		this.x_adj = x_adj;
		this.y_adj = y_adj;
		this.color = color;
		this.value = value;
		this.x = x
		this.y = y
		this.lives = lives;
		this.abilities = abilities;
		
		this.tile_direction["up"] = [{x : tile.x,y :tile.y -144}, {x : tile.x -48,y : tile.y -144}, {x : tile.x - 96,y : tile.y - 144}, {x : tile.x -48,y : tile.y -144}]
		this.tile_direction["right"] = [{x : tile.x,y : tile.y -96}, {x : tile.x -48,y : tile.y -96}, {x : tile.x -96,y : tile.y -96}, {x : tile.x -48,y : tile.y -96}]
		this.tile_direction["down"] = [{x : tile.x,y : tile.y}, {x : tile.x - 48,y : tile.y}, {x : tile.x - 96,y : tile.y}, {x : tile.x - 48,y : tile.y}]
		this.tile_direction["left"] = [{x : tile.x,y : tile.y -48}, {x : tile.x -48,y : tile.y -48}, {x : tile.x -96,y : tile.y -48}, {x : tile.x -48,y : tile.y -48}]
		return	gen_id;			
	}
	//reduction_rate : the lower the rate the slower:    1 would reduce the speed to 50%, 0.1 would reduce the speed to 1%
	set_speed(speed) {		

			this.speed = speed;
	}
	
	check_abilities() {
		for (var ability = 0; ability <= (this.abilities.length - 1); ability++) {
				var unit_ability = this.abilities[ability].ability
				var unit_ability_amount = this.abilities[ability].value
				var unit_ability_frequency = this.abilities[ability].frequency
				this[unit_ability](unit_ability_amount, unit_ability_frequency);
		}
	}
	
	Heal(value, frequency) {
		
		setTimeout(() => {
			this.update_hp(value*-1)
		}, frequency);
	}
	
	Spawn(value, frequency) {
		//NOT IMPLEMENTED
		setTimeout(() => {
			//this.update_hp(value*-1)
		}, frequency);
	}
	
	Unfocus(value, frequency) {
		sortObj(units);
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
			this.remove();		
			return true;
		}
		return false
	}
	/*
	Create visual representation of the object
	*/
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

	remove() {
		delete units[this.id];
		$("#"+this.id).remove();
		update_gui();
	}

	
	set_path(path) {
		this.path = path;
	}
	
	run() {
		if (this.segment >= this.path.length) {
			console.log("Finished");
			this.remove();
			lives -= this.lives;
			update_gui()
			if (lives <= 0) {
				console.log("Game over!")
			}
		}
		else {
			this.move_to()
		}
	}
	
	move_to() {
		var delta_x;
		var delta_y;
		if (this.segment == 0) {
			delta_x = this.x - this.path[(this.segment)].x;
			delta_y = this.y - this.path[(this.segment)].y;
		}
		else {
			delta_x = this.path[(this.segment-1)].x - this.path[(this.segment)].x;
			delta_y = this.path[(this.segment-1)].y - this.path[(this.segment)].y;
		}

//right or up, but More movement on Y then on X
		if (delta_y < 0 && Math.abs(delta_y) > Math.abs(delta_x)) {

			this.move("down", delta_y)
		}
		
		if (delta_y > 0 && Math.abs(delta_y) > Math.abs(delta_x)) {

			this.move("up", delta_y)
		}
		
		if (delta_x < 0 && Math.abs(delta_x) > Math.abs(delta_y)) {

			this.move("right", delta_x)
		}
		
		if (delta_x > 0 && Math.abs(delta_x) > Math.abs(delta_y)) {

			this.move("left", delta_x)
		}


	}
	//this.segment != segment!!
	move(direction, distance) {
		
		var topOrLeft = (direction=="left" || direction=="right") ? "left" : "top";
		var gui_element = $("#"+this.id)
		
		var gui_element_directional_position = parseInt(gui_element.css(topOrLeft)); //current gui element position
		var isNegated = (direction=="down" || direction=="right");
		distance *= -1; 
		
		
		var destination = gui_element_directional_position + distance; //x or y location of where I need to go
		//var frameDistance = distance / (this.speed / 10); //should this be constant?
		var frameDistance = 5; //should this be constant?
		
		
		//back_pos_x =
		//back_pos_y =
	
		this.mytimer = new Timer(() => {	

			if (this.tile_sequence  == 0) {
				this.check_abilities();
			}
			this.tile_sequence++;
			this.tile_sequence = this.tile_sequence > 3 ? 0 : this.tile_sequence;
			this.tile_sequence > 3 ? 0 : this.tile_sequence;
			var sequence = Math.floor(this.tile_sequence)
			
			var back_pos = this.tile_direction[direction][sequence]
			var gui_element_directional_position = parseInt(gui_element.css(topOrLeft)); //current gui element position
			var newloccomparison = destination	
			var adj_dest = (direction=="left" || direction=="right") ? 0 : (this.y_adj /10);
			
			if (!isNegated) { frameDistance = Math.abs(frameDistance) * - 1; }				
			var newLocation = gui_element_directional_position + frameDistance;
			
			var beyondDestination = between(newLocation, (destination - 25 + adj_dest), (destination + 25 + adj_dest))						

			if (beyondDestination) {					
			 //element.style[topOrLeft] = destination + "px";
				if (topOrLeft == "top") {
					gui_element.css({top: newLocation});

				}
				else {
					gui_element.css({left: newLocation});
				}
				//Update segment!
				this.mytimer.stop();
				this.segment++;
				setTimeout(() => {
					//do what you need here
					this.run();
				}, 10);
				
				
			}
			else {			
				gui_element.css({'background-position-x': 0});
				gui_element.css({'background-position-y': 0});
				gui_element.css({'background-position-x': back_pos.x});
				gui_element.css({'background-position-y': back_pos.y});
				if (debug) {
					gui_element.html(back_pos.x+", "+back_pos.y)
				}
				if (topOrLeft == "top") {
					
					gui_element.css({"top": newLocation});
					this.mytimer.resume();
				}
				else {
				
					gui_element.css({left: newLocation});
					this.mytimer.resume();
				}
			}
		}, this.speed);
		
		wavetimers.push(this.mytimer);
	}
	
	stop() {
		this.mytimer.stop();
	};//end of stop
}
