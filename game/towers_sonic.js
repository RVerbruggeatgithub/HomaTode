class SonicTower extends Tower {
	constructor(){
		super(); 
		this.always_hit = false;
		this.range = 225;
		this.atk_speed = 1000;
		this.rof = 1600;
		this.atk = 6;
		this.price = [120, 50, 90, 150, 200]
		this.value = [60, 85, 125, 165, 250]
		this.towergraphic = "tower_sonic";
		this.weapon = "Sonicwave_1";
		this.minimum_range = 50;

		
		this.level_bonus = {'rof' : [0.01, 0.01, 0.02, 0.0],
				'atk_speed' : [0.05, 0.09, 0.14, 0],
				'range' : [0.1, 0.1, 0.15, 0],
				'atk' : [0.25, 0.32, 0.45, 0.25],  
				'max_splash_range' : [0.1, 0.1, 0.1, 0.1],
				'max_splash_damage' : [0.25, 0.32, 0.45, 0],
				}
	}
	
	get_tower_details_as_html(){
	
		var empty_str = "";
		var header = "Sonic Tower"
		var level = ""
		for (var y = 0; y < this.level; y++) { level = level + "★"}
		level = "<span class='stars'>"+ level +"</span>"
		var sell_price = 0;
		var upgrade_price = 0;
		var description = "Ignores target armor."
		var icon_1 = "<li class='icon_rof'>"+this.rof+"</li>"
		var icon_2 = "<li class='icon_atk_speed'>"+this.atk_speed+"</li>"
		var icon_3 = "<li class='icon_range'>"+this.range+"</li>"
		var icon_4 = "<li class='icon_atk'>"+this.atk+"</li>"
		var icon_5 = "<li class='icon_ignore_armor'></li>";
		upgrade_price = this.level < 5 ? "$"+this.price[this.level] : "N/A";
		var contents = empty_str.concat("<h3>", header, " ", level, "<br /> (Sell $", this.value[this.level - 1], " Upgrade cost: ", upgrade_price ,")</h3>", description, "<br />", "<ul>", icon_1, icon_2, icon_3, icon_4, icon_5,"</ul>");
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
				this.atk = Math.round(this.atk + this.level_bonus['atk'][this.level - 2] * this.atk); //20% atk increase
				this.max_splash_range = Math.round(this.max_splash_range + this.level_bonus['max_splash_range'][this.level - 2] * this.max_splash_range);
				this.max_splash_damage = Math.round(this.max_splash_damage + this.level_bonus['max_splash_damage'][this.level - 2] * this.max_splash_damage); //20% atk increase
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
	
	
	attack() {
		this.mytimer = setInterval(() => {
				try {
					var target_exists = $("#"+this.targetId).length;
					
					if (target_exists) {
					
						if (calcDistance(this.id, this.targetId) >= this.range || calcDistance(this.id, this.targetId) < this.minimum_range) {
							clearInterval(this.mytimer);
							this.max_idletimer = 50;
							this.targetId = null;
							this.idle();
						}
						else {
							//turn?
							
							var opponent = units[this.targetId];	//this.target not working for Structures at this time!!
							var opponent_gui_location = $("#"+this.targetId);
				
							var unit_x = this.x
							var unit_y = this.y
							var unit_w = this.size
							var unit_h = this.size
						
							var bullet_start_x = unit_x + (this.size / 2) - 5; //5 is half the height of bullet
							var bullet_start_y = unit_y + (this.size / 2) - 5; //5 is half the height of bullet
							
							var target_x = parseInt(opponent_gui_location.css("left"));
							var target_y = parseInt(opponent_gui_location.css("top"));
							var target_w = parseInt(opponent_gui_location.css("width"));
							var target_h = parseInt(opponent_gui_location.css("height"));
						
							var bullet_end_x = target_x + (target_w / 2) - 5; //5 is half the height of bullet
							var bullet_end_y = target_y + (target_h / 2) - 5 ; //5 is half the height of bullet
							
							var degrees = pointDirection(bullet_start_x, bullet_start_y, bullet_end_x, bullet_end_y)
						

							if (!pause_game){
								$("#"+this.turret_id).css({
									 '-moz-transform':'rotate('+degrees+'deg)',
									 '-webkit-transform':'rotate('+degrees+'deg)',
									 '-o-transform':'rotate('+degrees+'deg)',
									 '-ms-transform':'rotate('+degrees+'deg)',
									 'transform':'rotate('+degrees+'deg)'
								});
							
								this.attack_fire();
								
							}
						}
					}
					else {
						clearInterval(this.mytimer);
						this.max_idletimer = 50;
						this.targetId = null;
						this.idle();
					}
				}
				catch(error) {
					if (debug) {
						console.log(error)
					}
					clearInterval(this.mytimer);
					this.idle();
					this.targetId = null;
					return;
				}
			}, this.atk_speed);
		
	}	
	
	attack_fire() {

		
			//_unit_obj = this.get_unit_gui_obj();
			var opponent = units[this.targetId];	//this.target not working for Structures at this time!!
			var opponent_gui_location = $("#"+this.targetId);
			var is_dead = false;
			
			try {
				var unit_x = this.x
				var unit_y = this.y
				var unit_w = this.size
				var unit_h = this.size
				
				var bullet_start_x = unit_x + (this.size / 2) - 5; //5 is half the height of bullet
				var bullet_start_y = unit_y + (this.size / 2) - 5; //5 is half the height of bullet
				
				var target_x = parseInt(opponent_gui_location.css("left"));
				var target_y = parseInt(opponent_gui_location.css("top"));
				var target_w = parseInt(opponent_gui_location.css("width"));
				var target_h = parseInt(opponent_gui_location.css("height"));
				
				var max_accuracy = 20;
				var accuracy_adjuster_x = Math.floor(Math.random() * max_accuracy) - 10;
				var accuracy_adjuster_y = Math.floor(Math.random() * max_accuracy) - 10;
				
				var bullet_end_x = target_x + (target_w / 2) - 5 + accuracy_adjuster_x; //5 is half the height of bullet
				var bullet_end_y = target_y + (target_h / 2) - 5 + accuracy_adjuster_y; //5 is half the height of bullet
				var freeze_on_hit = false;
				
				if (this.level == 5) {
					freeze_on_hit = true;
				}
				var fire_weapon = new Sonicwave();
				fire_weapon.create(opponent, this.is_projectile, this.weapon, true, bullet_start_x, bullet_start_y, bullet_end_x, bullet_end_y, this.rof, this.atk, this.max_splash_damage, this.max_splash_range, freeze_on_hit)
				fire_weapon.action();
					


			}
			catch(error) {
				if (debug) {
					console.log(error)
				}
			 //console.log("error", err); //The unit is already removed.
				opponent_gui_location.remove();
			  return;
			}

		if (is_dead) {
			clearInterval(this.mytimer);
			this.idle();
			this.targetId = null;
		}
		
	}					
	
}	