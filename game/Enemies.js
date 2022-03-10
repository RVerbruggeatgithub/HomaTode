class Enemy {
	constructor() {
		this.id = null;
		this.size = 0; //radius
		this.x = 0; //x locatin
		this.y = 0; //y_location
		this.x_adj = 0
		this.y_adj = 0;
		this.hp = 0;
		this.armor = 0;
		this.speed = 50; //higher is faster
		this.max_speed = 50;
		this.segment_start_time = 50;
		this.segment = 0;
		this.value = 0;
		this.max_hp = 0;
		this.color = "green";
		this.mytimer = null;
		this.tile_direction = []
		this.tile_sequence = 0;
		this.heal = 0;
		this.lives = 1;
		this.heal_frequency = 0;
		this.path = null;
		this.tile = {x: 0, y: 0};
		this.name = "Generic";
		this.description = "Generic enemy."
		this.special_1 = "";
		this.special_2 = "";
		this.present_image = "";
	}
	
	construct_unit(id, x, y, x_adj, y_adj) {
	//console.log(x, y, $("document").offset());
		this.id = id;
		this.x_adj = x_adj;
		this.y_adj = y_adj;
		this.x = x
		this.y = y

		this.tile_direction["up"] = [{x : this.tile.x,y :this.tile.y -144}, {x : this.tile.x -48,y : this.tile.y -144}, {x : this.tile.x - 96,y : this.tile.y - 144}, {x : this.tile.x -48,y : this.tile.y -144}]
		this.tile_direction["right"] = [{x : this.tile.x,y : this.tile.y -96}, {x : this.tile.x -48,y : this.tile.y -96}, {x : this.tile.x -96,y : this.tile.y -96}, {x : this.tile.x -48,y : this.tile.y -96}]
		this.tile_direction["down"] = [{x : this.tile.x,y : this.tile.y}, {x : this.tile.x - 48,y : this.tile.y}, {x : this.tile.x - 96,y : this.tile.y}, {x : this.tile.x - 48,y : this.tile.y}]
		this.tile_direction["left"] = [{x : this.tile.x,y : this.tile.y -48}, {x : this.tile.x -48,y : this.tile.y -48}, {x : this.tile.x -96,y : this.tile.y -48}, {x : this.tile.x -48,y : this.tile.y -48}]	
	}
	

	
	//reduction_rate : the lower the rate the slower:    1 would reduce the speed to 50%, 0.1 would reduce the speed to 1%
	set_speed(speed) {		

			this.speed = speed;
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

	
	update_hp(hp_mod, ignore_armor = false) {
		if (hp_mod >= 0) {
			
			var damage_amplification = Math.round(enemies_increased_damage_recieved_percentage/100 * hp_mod);
			var damage_reduction = ignore_armor ? 0 : this.armor
			hp_mod = hp_mod - damage_reduction + damage_amplification;
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
			var bonus_cash = Math.round(cash_bonus_percentage / 100 * this.value);
			Banked += (this.value + bonus_cash);
			enemies_killed++;
			update_gui();
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
		this.present_image = $.parseHTML( $div )
		$(document.body).append($div)
	}	

	remove() {
		delete units[this.id];
		$("#"+this.id).remove();
		enemies_removed++;
		update_gui();
	}

	
	set_path(path) {
		this.path = path;
	}
	
	
	run() {
		//console.log("running segment",this.segment );
		if (this.segment >= this.path.length) {
			this.remove();
			lives -= this.lives;
			enemies_passed++;
			update_gui()
		}
		else {
			var delta_x, delta_y;
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

				this.move("down")
			}
			
			if (delta_y > 0 && Math.abs(delta_y) > Math.abs(delta_x)) {

				this.move("up")
			}
			
			if (delta_x < 0 && Math.abs(delta_x) > Math.abs(delta_y)) {

				this.move("right")
			}
			
			if (delta_x > 0 && Math.abs(delta_x) > Math.abs(delta_y)) {

				this.move("left")
			}
		}
	}
	
	old_run() {
		
	console.log("running segment",this.segment );

		if (this.segment >= this.path.length) {
			console.log("Finished");
			this.remove();
			lives -= this.lives;
			enemies_passed++;
			update_gui()

		}
		else {
	
			this.move_to()
		}
	}
	
	move_to() {
		var delta_x, delta_y;
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

					this.move("down")
				}
				
				if (delta_y > 0 && Math.abs(delta_y) > Math.abs(delta_x)) {

					this.move("up")
				}
				
				if (delta_x < 0 && Math.abs(delta_x) > Math.abs(delta_y)) {

					this.move("right")
				}
				
				if (delta_x > 0 && Math.abs(delta_x) > Math.abs(delta_y)) {

					this.move("left")
				}
	}
	//this.segment != segment!!
	move(direction) {
	
		//console.log("moving", direction)
		

		var topOrLeft = (direction=="left" || direction=="right") ? "left" : "top";
		var modifyer = (direction=="up" || direction=="left") ? -1 : 1;
		var segment_destination = this.path[this.segment];
		var gui_element = $("#"+this.id)
		var tolerance = { x: this.x_adj, y: this.y_adj}
		var step = (this.speed/10) * modifyer;
		var current_segment_center_x = segment_destination.x;
		var current_segment_center_y = segment_destination.y;
		var next_hop = false;
		

	
	//console.log(segment_destination, this.x_adj, this.y_adj);		
			
			var enemy_center_x = Math.round(parseInt(gui_element.css("left")) + (parseInt(gui_element.css("width")) / 2))
			var enemy_center_y = Math.round(parseInt(gui_element.css("top")) + (parseInt(gui_element.css("height")) / 2))
			var newLocation = parseInt(gui_element.css(topOrLeft)) + step;
			this.tile_sequence++;
			this.tile_sequence = this.tile_sequence > 3 ? 0 : this.tile_sequence;
			this.tile_sequence > 3 ? 0 : this.tile_sequence;
			var sequence = Math.floor(this.tile_sequence)
			try {
				var back_pos = this.tile_direction[direction][sequence]
				gui_element.css({'background-position-x': 0});
				gui_element.css({'background-position-y': 0});
				gui_element.css({'background-position-x': back_pos.x});
				gui_element.css({'background-position-y': back_pos.y});
			}
			catch (error) {
				if (debug) {
				console.log(error)
				}
			}
			
			
			switch(direction) {
				 case "down":
					gui_element.css({"top": newLocation});
					if (enemy_center_y >= current_segment_center_y) {
						this.segment++;
					}

					break;
					
				 case "up":
					gui_element.css({"top": newLocation});				
					if (enemy_center_y <= current_segment_center_y) {
						this.segment++;
					}
	
					break;
					
				case "right":
					gui_element.css({"left": newLocation});
					if (enemy_center_x >= current_segment_center_x) {
						this.segment++;
					}
					break;
					
				case "left":
					gui_element.css({"left": newLocation});
					if (enemy_center_x < current_segment_center_x) {
						this.segment++;
					}
					break;
										
				default:
					direction = "next_hop";
					break;				

						
			}
				
			
			
		
	}
	
	stop() {
		this.mytimer.stop();
	};//end of stop
	
	get_enemy_details_as_html() {
		var header = this.name;
		var empty_str = "";
		var description = this.description
		var icon_1 = "<li class='icon_empty'>HP: "+this.max_hp+"</li>"
		var icon_2 = "<li class='icon_empty'>Armor: "+this.armor+"</li>"
		var icon_3 = "<li class='icon_empty'>Speed: "+this.speed+"</li>"
		var icon_4 = "<li class='icon_empty'>Value: "+this.value+"</li>"
		var enemy_image = "<div style='background-image: url(images/aliens.png);  position:relative;left: "+this.x+";top: "+this.y+"; height: "+this.size+"px; width: "+this.ysize+"px;'> </div>"
		var contents = empty_str.concat("<div class='help_box'><h3>", header, "</h3>", this.present_image, "<p>", description, "</p>","<div class='help_list'><ol class='stats'>", icon_1, icon_2,  icon_3, icon_4, "</li></ol></div>", this.special_1, this.special_2 ,"</div>");
		return contents;
	}
	
	//Get element {x : x, y : y}
	get_location() {
		var gui_element = $("#"+this.id)
		var enemy_center_x = parseInt(gui_element.css("left")) 
		var enemy_center_y = parseInt(gui_element.css("top"))
		return {x: enemy_center_x, y: enemy_center_y}
	}
}
