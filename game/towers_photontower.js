class PhotonTower extends Tower {
	constructor(){
		super(); 
		this.range = 250;
		this.atk_speed = 2500;
		this.rof = 500;
		this.atk = 0;
		this.size = 75;
		this.duration = 500;
		this.price = [350, 100, 150, 200, 300]
		this.value = [175, 225, 300, 400, 550]
		this.towergraphic = "tower_photontower"
		this.weapon = "Orb_1";
		this.max_splash_range = 75; 
		this.level_bonus = {'rof' : [0.01, 0.01, 0.02, 0.03],
				'atk_speed' : [0.05, 0.09, 0.14, 0.19],
				'range' : [0, 0, 0.15, 0.15],
				'atk' : [0, 0, 0, 0],  //max 200%  total = 3x damage then level 1
				'max_splash_range' : [0.05, 0.08, 0.11, 0.15],
				'duration' : [0.2, 0.17, 0.14, 0.125],
				}
	}
	
	remove () {
		delete towers[this.id] 
		$("#"+this.id).remove();
	}
	
	create() {			
		var $div = "<div id='"+this.id+"' class='tower_base_2' style='position:absolute;left: "+this.x+";top: "+this.y+"; width: "+this.size+"px; height: "+this.size+"px'><div id='turret_"+this.id+"' class='"+this.towergraphic+"_1' style='width: "+(this.level+6)+"px; height: "+(this.level+6)+"px; display: block; left: "+(this.size-42)+"px; top: "+(this.size-42)+";'><div></div>"
		$(document.body).append($div)
		this.turret_id = "turret_"+this.id;
	}
	
	get_tower_details_as_html(){
	
		var empty_str = "";
		var header = "Photon Deaccellerator"
		var level = ""
		for (var y = 0; y < this.level; y++) { level = level + "★"}
		level = "<span class='stars'>"+ level +"</span>"
		var sell_price = 0;
		var upgrade_price = 0;
		var description = "UPDATE DESCRIPTION."
		var icon_1 = "<li class='icon_rof'>"+this.rof+"</li>"
		var icon_2 = "<li class='icon_atk_speed'>"+this.atk_speed+"</li>"
		var icon_3 = "<li class='icon_range'>"+this.range+"</li>"
		var icon_4 = "<li class='icon_duration'>"+this.duration+"</li>"
		upgrade_price = this.level < 5 ? "$"+this.price[this.level] : "N/A";
		var contents = empty_str.concat("<h3>", header, " ", level, "<br /> (Sell $", this.value[this.level - 1], " Upgrade cost: ", upgrade_price ,")</h3>", description, "<br />", "<ul>", icon_1, icon_2, icon_3, icon_4, "</ul>");
		console.log(header);
		return contents;
	}
	
	upgrade() {	
		if (this.price[this.level] <= Banked) {
			Banked -= this.price[this.level]
			update_gui()
			if (this.level < 5) {
				$("#turret_"+this.id).toggleClass(this.towergraphic+"_"+this.level)
				this.level++;
				$("#turret_"+this.id).addClass(this.towergraphic+"_"+this.level)
								
				this.rof = Math.round(this.rof - this.level_bonus['rof'][this.level - 2] * this.rof); // speed bullet travels
				this.atk_speed = Math.round(this.atk_speed - this.level_bonus['atk_speed'][this.level - 2]	 * this.atk_speed); //20% rate of attack increase
				this.range = Math.round(this.range + this.level_bonus['range'][this.level - 2] * this.range); //20% range increase
				this.max_splash_range = Math.round(this.max_splash_range + this.level_bonus['max_splash_range'][this.level - 2] * this.max_splash_range);
				this.duration = Math.round(this.duration + this.level_bonus['duration'][this.level - 2] * this.duration);
			}
		}
		else {
			if (this.level >= 5) {
				console.log("Already Max level.");
			}
			else {
				console.log("Insufficient funds.", this.price[this.level]);
			}
		}
	}

	attack	() {
		this.attack_fire();
	}		
	
	attack_fire() {
				this.sleep();
				//_unit_obj = this.get_unit_gui_obj();
				var opponent = units[this.targetId];	//this.target not working for Structures at this time!!
				var opponent_gui_location = $("#"+this.targetId);
				var tower_gui_location = $("#"+this.id);
				var me = towers[this.id]
				var is_dead = false;
				
				try {
					var unit_x = this.x
					var unit_y = this.y
					var unit_w = this.size
					var unit_h = this.size
					
					var bullet_start_x = unit_x; //5 is half the height of bullet
					var bullet_start_y = unit_y; //5 is half the height of bullet
													
					var max_splash_range = this.max_splash_range
					var speed_reduction_time = this.duration;
					//need to make sure the HP is reduced upon hit and not while just fired..
					var spawn_point_x = unit_x + (unit_w / 2) - 125
					var spawn_point_y =  unit_y + (unit_h / 2) - 145
					var freeze_duration = this.duration;
					
					if  (spawn_point_x > 0 && spawn_point_y > 0 && tower_gui_location.length) {
						var $div = $("<div>", {"class": "shockwave"}).css({"left": spawn_point_x, "top" : spawn_point_y, "position" : "absolute"}).fadeOut((this.range * 10), function() {  //(this.range * 5)
							$(this).remove(); 
						})
						$(document.body).append($div)
					}
						
						$( ".unit" ).each(function( index ) {
							var target_gui_location = $("#"+this.id);
							var sel_u = units[this.id]
							var target_x = parseInt(target_gui_location.css("left"));
							var target_y = parseInt(target_gui_location.css("top"));
							var check_distance = calcDistanceByCoordinates(unit_x, unit_y, target_x, target_y)								
								if (check_distance <= max_splash_range) {
										
										sel_u.mytimer.pause(freeze_duration);
										var speed_reduction_timer = setTimeout(() => {
											sel_u.mytimer.resume();
										}, freeze_duration);

								}
							
						});

				}
				catch(error) {
				 //console.log("error", err); //The unit is already removed.
					if (debug) {
						console.log(error)
					}
				  return;
				}

			
			
	}	
	
	sleep() {	

		this.idle_timer = setInterval(() => {
			clearInterval(this.idle_timer);
			this.attack();
		}, this.atk_speed);
	}	
}	