class LaserTower extends Tower {
	constructor(){
		super(); 
		this.range = 275;
		this.atk_speed = 1000;
		this.rof = 1500;
		this.atk = 100;
		this.price = [150, 75, 120, 180, 275, 400]
		this.value = [75, 115, 160, 250, 355, 450]
		this.towergraphic = "tower_laser"
		this.weapon = "Laser_1";
		this.level_bonus = {'rof' : [0.01, 0.01, 0.02, 0.03, 0.01],
				'atk_speed' : [0.04, 0.08, 0.12, 0.16, 0.08],
				'range' : [0.1, 0.1, 0.1, 0.1, 0.05],
				'atk' : [0.28, 0.28, 0.35, 0.46, 0.50],  
				'laser_width' : [0, 1, 2, 2, 3, 5], 
				}
	}
	
	get_tower_details_as_html(){
			
				var empty_str = "";
				var header = "Laser Tower"
				var level = ""
				for (var y = 0; y < this.level; y++) { level = level + "★"}
				level = "<span class='stars'>"+ level +"</span>"
				var sell_price = 0;
				var upgrade_price = 0;
				var description = "This tower shoots a focused laser exacting high amount of damage to its target. Slow reload."
				var icon_1 = "<li class='icon_rof'>"+this.rof+"</li>"
				var icon_2 = "<li class='icon_atk_speed'>"+this.atk_speed+"</li>"
				var icon_3 = "<li class='icon_range'>"+this.range+"</li>"
				var icon_4 = "<li class='icon_atk'>"+this.atk+"</li>"
				upgrade_price = this.level < 6 ? "$"+this.price[this.level] : "N/A";
				var contents = empty_str.concat("<h3>", header, " ", level, "<br /> (Sell $", this.value[this.level - 1], " Upgrade cost: ", upgrade_price ,")</h3>", description, "<br />", "<ul>", icon_1, icon_2, icon_3, icon_4, "</ul>");
				console.log(header);
				return contents;
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
						
						var bullet_start_x = unit_x + (this.size / 2) -2; //5 is half the height of bullet
						var bullet_start_y = unit_y + (this.size / 2) -2; //5 is half the height of bullet
						
						var target_x = parseInt(opponent_gui_location.css("left"));
						var target_y = parseInt(opponent_gui_location.css("top"));
						var target_w = parseInt(opponent_gui_location.css("width"));
						var target_h = parseInt(opponent_gui_location.css("height"));
													
							var bullet_end_x = target_x + (target_w / 2); 
							var bullet_end_y = target_y + (target_h / 2); 
							/*var $div = $("<div>", {"class": "Bullet_1"}).css({"left": bullet_start_x, "top" : bullet_start_y}).animate({ left: bullet_end_x, top: bullet_end_y}, 250).fadeOut(50, function() {
								$(this).remove(); 
								})
								*/
							//
							lineDraw(bullet_start_x, bullet_start_y, bullet_end_x, bullet_end_y, this.level_bonus['laser_width'][this.level - 1])
		
							//need to make sure the HP is reduced upon hit and not while just fired..
							var t = setTimeout(() => {
								is_dead = opponent.update_hp(this.atk)
								update_gui()
								//opponent.hp -= this.atk;
								clearInterval(t);
							}, 100);

					}
					catch(error) {
					  if (debug) {
							console.log(error)
						}

					  return;
					}

				if (is_dead) {
					update_gui()
					clearInterval(this.mytimer);
					this.idle();
				}
				
			}
}	