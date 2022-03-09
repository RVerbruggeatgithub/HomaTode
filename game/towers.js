/*
Base Tower class
*/
class Tower {
	constructor() {
		this.always_hit = false;
		this.height = 50;
		this.width = 50;
		this.x = 0;
		this.y = 0;
		this.size = 50;
		this.level = 1;
		this.id = null,
		this.mytimer = null;
		this.idle_timer = null;
		this.targetId = null;
		this.turret_id = null;
		this.mode = "idle";
		this.max_idletimer = 10;

	}
	
	
	construct_tower(x, y) {

		var gen_id = "tower_"+getRndInteger(10000, 1000000); 
		this.id = gen_id 
		this.x = x; //360
		this.y = y;//8		
	}
	
	/*
	Create the html element and corrolates the element id to the Tower ID.
	*/
	create() {
		var $div = "<div id='"+this.id+"' class='tower_base' style='position:absolute;left: "+this.x+";top: "+this.y+"; width: "+this.size+"px; height: "+this.size+"px'><div id='turret_"+this.id+"' class='"+this.towergraphic+"_1' style='width: 90%; height: 90%; display: block'><div></div>"
		$(document.body).append($div)
		this.turret_id = "turret_"+this.id;
	}
	
	/*
	Updates tower parameters
	*/
	upgrade() {
		
		if (this.price[this.level] <= Banked) {
			Banked -= this.price[this.level]
			update_gui()
			if (this.level < 6) {
				$("#turret_"+this.id).toggleClass(this.towergraphic+"_"+this.level)
				this.level++;
				$("#turret_"+this.id).addClass(this.towergraphic+"_"+this.level)
								
				this.rof = Math.round(this.rof - this.level_bonus['rof'][this.level - 2] * this.rof); // speed bullet travels
				this.atk_speed = Math.round(this.atk_speed - this.level_bonus['atk_speed'][this.level - 2]	 * this.atk_speed); //20% rate of attack increase
				this.range = Math.round(this.range + this.level_bonus['range'][this.level - 2] * this.range); //20% range increase
				this.atk = Math.round(this.atk + this.level_bonus['atk'][this.level - 2] * this.atk); //20% atk increase
			}
		}
		else {
			if (this.level >= 5 && !level_6_tower) {
				console.log("Already Max level.");
			}
			else if (this.level >= 6 && level_6_tower) {
				console.log("Already Max level.");
			}
			else {
				console.log("Insufficient funds.", this.price[this.level]);
			}
		}
	}	
	
	sell() {
		Banked += this.value[this.level-1]
		update_gui();
		this.remove();
	}

	stop() {
		clearInterval(this.mytimer)
		clearInterval(this.idle_timer);
	};//end of stop
	
	
	/*
	Removes the html element and corrolating element id from the towers array.
	*/
	remove () {
		delete towers[this.id] 
		
		$("#tower_menu").hide();
		$("#"+this.id).remove();
	}
	
	attack() {
		
			this.mytimer = setInterval(() => {
				try {
					var target_exists = $("#"+this.targetId).length;
					if (target_exists) {
						if (calcDistance(this.id, this.targetId) >= this.range) {
							clearInterval(this.mytimer);
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
					/*var $div = $("<div>", {"class": "Bullet_1"}).css({"left": bullet_start_x, "top" : bullet_start_y}).animate({ left: bullet_end_x, top: bullet_end_y}, 250).fadeOut(50, function() {
						$(this).remove(); 
						})
						*/
					//

					var fire_weapon = new Weapon();
					fire_weapon.create(this.always_hit, this.weapon, true, bullet_start_x, bullet_start_y, bullet_end_x, bullet_end_y, this.rof)
					fire_weapon.action();				
					//need to make sure the HP is reduced upon hit and not while just fired..
					var t = setTimeout(() => {
						is_dead = opponent.update_hp(this.atk)
						//opponent.hp -= this.atk;
						clearInterval(t);
					}, this.rof);

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
			//this.sleep();
			this.idle();
			this.targetId = null;
		}
		
	}	
	
	idle() {
	
		if (this.targetId != null) {
		
			this.mode = "attacking"
			this.attack();
		}
		else {
			this.mode = "idle"
			var self = this;
			$( ".unit" ).each(function( index ) {

					var unit_elem = this.id;					
					if (this.id == self.targetId) {
						if (calcDistance(self.id, unit_elem) >= self.range) {						
							//already targetting but now out of range
							
							self.targetId = null
							return false; // breaks
						}
						else { 
							//already targetting and still in range
							
							self.targetId = this.id
							self.mode = "attacking";
							return false; // breaks
						}
					}
					if (self.targetId == null && calcDistance(self.id, unit_elem) < self.range) {	
									
						self.targetId = unit_elem
						self.mode = "attacking";
						return false; // breaks
					}	
			});
				if (self.mode == "attacking" && this.targetId != null) {	
					
					this.attack();
				}
		}	
	}
}