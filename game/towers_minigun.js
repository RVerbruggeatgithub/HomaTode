class MinigunTower extends Tower {
	constructor(){
		super(); 
		this.range = 200;
		this.atk_speed = 300;
		this.rof = 1000;
		this.atk = 6;
		
		this.price = [50, 25, 60, 100, 150, 275]
		this.value = [25, 35, 65, 115, 190, 250]
		this.towergraphic = "tower_minigun" //"tower_minigun"
		this.weapon = "Orb_2";
		this.level_bonus = {'rof' : [0.01, 0.01, 0.02, 0.0, 0.03],
				'atk_speed' : [0.05, 0.09, 0.14, 0, 0.12],
				'range' : [0.1, 0.1, 0.15, 0, 0.05],
				'atk' : [0.25, 0.32, 0.45, 0, 0.25],  //max 200%  total = 3x damage then level 1
				}
	}
	
	get_tower_details_as_html(){
		var simultaneous_shots = 1;
		if (this.level == 5) {
			var simultaneous_shots = 2;
		}
		if (this.level == 6) {
			var simultaneous_shots = 3;
		}
		var empty_str = "";
		var header = "Minigun Tower"
		var level = ""
		for (var y = 0; y < this.level; y++) { level = level + "★"}
		level = "<span class='stars'>"+ level +"</span>"
		var sell_price = 0;
		var upgrade_price = 0;
		var description = "This rapid firing minigun has a fast attack speed and is cheap, at level 5 get dual fire. It does lack in range"
		var icon_1 = "<li class='icon_rof'>"+this.rof+"</li>"
		var icon_2 = "<li class='icon_atk_speed'>"+this.atk_speed+"</li>"
		var icon_3 = "<li class='icon_range'>"+this.range+"</li>"
		var icon_4 = "<li class='icon_atk'>"+this.atk+"</li>"
		var icon_5 = this.level >= 5 ? "<li class='icon_dual_fire'>"+simultaneous_shots+"</li>" : "";
		upgrade_price = this.level < 6 ? "$"+this.price[this.level] : "N/A";
		var contents = empty_str.concat("<h3>", header, " ", level, "<br /> (Sell $", this.value[this.level - 1], " Upgrade cost: ", upgrade_price ,")</h3>", description, "<br />", "<ul>", icon_1, icon_2, icon_3, icon_4, icon_5,"</ul>");
		console.log(header);
		return contents;
	}
	
	attack() {
		this.mytimer = setInterval(() => {
				try {
					if (calcDistance(this.id, this.targetId) >= this.range) {
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
						var target_w = opponent.size
						var target_h = opponent.size
					
						var bullet_end_x = target_x + (target_w / 2) - 5; //5 is half the height of bullet
						var bullet_end_y = target_y + (target_h / 2) - 5 ; //5 is half the height of bullet
						
						var degrees = pointDirection(bullet_start_x, bullet_start_y, bullet_end_x, bullet_end_y)
					
						$("#"+this.turret_id).css({
							 '-moz-transform':'rotate('+degrees+'deg)',
							 '-webkit-transform':'rotate('+degrees+'deg)',
							 '-o-transform':'rotate('+degrees+'deg)',
							 '-ms-transform':'rotate('+degrees+'deg)',
							 'transform':'rotate('+degrees+'deg)'
						});
						
						
						if (!global_pause){
							
							if (this.level >= 5) {
								this.attack_fire(-5);
								var a = setTimeout(() => {
							
									this.attack_fire(5);
									clearInterval(a);
								}, 50);
								if (this.level >= 6) {
									var a = setTimeout(() => {
							
									this.attack_fire(10);
									clearInterval(a);
								}, 50);
								}
								
							}
							else {
								this.attack_fire();
							}
						}
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

	attack_fire(offset = 0) {

		
			//_unit_obj = this.get_unit_gui_obj();
			var opponent = units[this.targetId];	//this.target not working for Structures at this time!!
			var opponent_gui_location = $("#"+this.targetId);
			var is_dead = false;
			
			try {
				var unit_x = this.x
				var unit_y = this.y
				
				var bullet_start_x = unit_x + (this.size / 2) - 15; //5 is half the height of bullet
				var bullet_start_y = unit_y + (this.size / 2)  - offset; //5 is half the height of bullet
				
				var target_x = parseInt(opponent_gui_location.css("left"));
				var target_y = parseInt(opponent_gui_location.css("top"));
				var target_w = parseInt(opponent_gui_location.css("width"));
				var target_h = parseInt(opponent_gui_location.css("height"));
				
					var max_accuracy = 20;
					var accuracy_adjuster_x = Math.floor(Math.random() * max_accuracy) - 10;
					var accuracy_adjuster_y = Math.floor(Math.random() * max_accuracy) - 10;
					
					var bullet_end_x = target_x + (target_w / 2) - 5 + accuracy_adjuster_x; //5 is half the height of bullet
					var bullet_end_y = target_y + (target_h / 2) - 5 + accuracy_adjuster_y; //5 is half the height of bullet					
					/*var $div = $("<div>", {"class": "Bullet_1"}).css({"left": bullet_start_x, "top" : bullet_start_y}).animate({ left: bullet_end_x, top: bullet_end_y}, 250).fadeOut(50, function() {
						$(this).remove(); 
						})
						*/
					//

					var fire_weapon = new Bullet();
					fire_weapon.create(opponent, this.always_hit, this.weapon, true, bullet_start_x, bullet_start_y, bullet_end_x, bullet_end_y, this.rof, this.atk)
					fire_weapon.action();				
					//need to make sure the HP is reduced upon hit and not while just fired..
					

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
			this.targetId = null;
		}
		
	}				
	
}	