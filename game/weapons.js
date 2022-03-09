class Weapon {
	constructor() {
		this.css_class = null;
		this.spawn_x = null;
		this.spawn_y = null;
		this.target_x = null;
		this.target_y = null;
		this.speed = null;
		this.directional = false;
		this.edge_x = null;
		this.edge_y = null;
		this.id = null;
		this.timer = null;
		this.stop_animation = false;
		this.always_hit = false;
		this.damage = 0;
		this.max_splash_damage = 0
		this.max_splash_range = 0
		this.opponent = null
		this.freeze_on_hit = false;
		
	}
	
	create(opponent, always_hit, _class, directional, spawn_x, spawn_y, target_x, target_y, speed, damage, max_splash_damage = null, max_splash_range = null, freeze_on_hit = false) {
		this.css_class = _class;
		this.spawn_x = spawn_x;
		this.spawn_y = spawn_y;
		this.always_hit = always_hit;
		this.target_x = target_x;
		this.target_y = target_y;
		this.directional = directional;
		this.speed = speed;
		this.damage = damage;
		this.max_splash_damage = max_splash_damage;
		this.max_splash_range = max_splash_range;
		this.opponent = opponent
		this.freeze_on_hit = freeze_on_hit;
	}

						
	action() {
		var degrees = 0;
		if (this.directional) {
			var degrees = pointDirection(this.spawn_x, this.spawn_y, this.target_x, this.target_y)
		}
		
				//bullet destination needs to be set to level bounderies and if the bullet hits a target on-touch, then action.
		/* let's do some math:
		
		Determine slope:
		slope is change of height / change of distance:
		*/
	
		if(this.always_hit) {
			var me = this
			var $div = $("<div>", {"class": this.css_class}).css({"left": this.spawn_x, "top" : this.spawn_y, '-moz-transform':'rotate('+degrees+'deg)',
								 '-webkit-transform':'rotate('+degrees+'deg)',
								 '-o-transform':'rotate('+degrees+'deg)',
								 '-ms-transform':'rotate('+degrees+'deg)',
								 'transform':'rotate('+degrees+'deg)'}).animate({ left: this.target_x, top: this.target_y}, this.rof).fadeOut(50, function() {
				me.hit(null, this.target_x, this.target_y);
				$(this).remove(); 
				})
			$(document.body).append($div)
		}
		
		else {
		
			var projecttile_exit = linear_extrapolate(this.spawn_x, this.spawn_y, this.target_x, this.target_y)
			console.log(degrees, this.spawn_x, this.spawn_y, projecttile_exit.x, projecttile_exit.y)
			var projectile_id = generate_unique_id("projectile_")
			this.id = projectile_id
			
			//this.create_projectile(degrees, this.spawn_x, this.spawn_y, projecttile_exit.x, projecttile_exit.y)
			//next section will need to be changed, to move the projectile to exits BUT stop if it hits an enemy..
			// also need to apply damage here
			var $div = $("<div id='"+projectile_id+"' class='"+this.css_class+"'>").css({"left": this.spawn_x, "top" : this.spawn_y, '-moz-transform':'rotate('+degrees+'deg)',
								 '-webkit-transform':'rotate('+degrees+'deg)',
								 '-o-transform':'rotate('+degrees+'deg)',
								 '-ms-transform':'rotate('+degrees+'deg)',
								 'transform':'rotate('+degrees+'deg)'}).animate({ left: projecttile_exit.x, top: projecttile_exit.y}, this.speed, function() {
					$(this).remove(); 
					this.remove();
				})
				
			$(document.body).append($div)
			
			
			this.track_element();
		}
	}
	
	hit(target, x, y) {
		
		var $div = $("<div><img src='images/boom.gif' height='25' width='25' />", {"class": "Explosion_1"}).css({"left": x, "top" : y, "position" : "absolute"	}).fadeOut(1250, function() {
			$(this).remove(); 
		})
		$(document.body).append($div)
		var opponent = units[target];
		var me = this;
		var bullet_end = {x: x, y: y}
		//splash damage actions..
		if (this.max_splash_damage != null && this.max_splash_range != null) {
			$( ".unit" ).each(function( index ) {
				var target_gui_location = $("#"+this.id);
				var target_x = parseInt(target_gui_location.css("left"));
				var target_y = parseInt(target_gui_location.css("top"));
				var cur_opponent = units[this.id] === undefined ? null : units[this.id];
				var opponent_id = opponent === undefined ? null : opponent.id;
				if (cur_opponent.id == target) {										
					//Regular damage
					cur_opponent.update_hp(me.damage)
					update_gui()
				}
				else {
					
					var check_distance = calcDistanceByCoordinates(bullet_end.x, bullet_end.y, target_x, target_y)
					var splash_damage_per_distance = me.max_splash_damage / me.max_splash_range											
					if (check_distance <= me.max_splash_range) {
					//The closer the unit to the source 'explosion' the more damage.
						var resulting_damage = Math.round(((me.max_splash_range - check_distance) + 1) * splash_damage_per_distance)
						//cur_opponent.hp -= resulting_damage
						cur_opponent.update_hp(resulting_damage)
						update_gui()

						
					}
				}
				
			});
		}
		//regular action
		else {
			try {
				var is_dead = opponent.update_hp(this.atk)
			}
			catch (error) {
				if (debug) {
					console.log(error)
				}
			}
		}
	}
	
	
	get_animation_status() {
		return this.stop_animation;
	}
	
	track_element(){
		var projectile_gui_location = $("#"+this.id);
		var step = 5;
		var target = null;
		var me = this;
		var src_x = parseInt(projectile_gui_location.css("left"));
		var src_y = parseInt(projectile_gui_location.css("top"));
		this.mytimer = new Timer(() => {	
			var running_timer = this.mytimer;
			//check if the coordinates touch an enemy..
			
			$( ".unit" ).each(function( index ) {
					var target_gui_location = $("#"+this.id);
					var target_x = parseInt(target_gui_location.css("left"));
					var target_y = parseInt(target_gui_location.css("top"));
					var cur_opponent = units[this.id]
		
					var check_distance = calcDistanceByCoordinates(src_x, src_y, target_x, target_y)
					
					if (check_distance <= 20) {
						console.log(this.id, check_distance);
						running_timer.stop(); 
						
						
						me.hit(this.id, src_x, src_y);
						projectile_gui_location.hide();
					}						
			})
			
			

			if (src_x <= 5 || src_y <= 5 || src_x > (window.innerWidth-10) || src_y > (window.innerHeight-10) || isNaN(src_x) || isNaN(src_y)) {
				console.log("stop", this.id, target);
				running_timer.stop(); 
				projectile_gui_location.hide();
			}
			else {
				this.track_element();
			}
		}, step);
	}
	
	
	//degrees is the angel of the projectile's image
	create_projectile(degrees, srcx, srcy, desx, desy) {
		
		var projectile_id = generate_unique_id("projectile_")
		this.id = projectile_id
		//1. create element at srcx, srcy
		var $div = $("<div id='"+projectile_id+"' class='"+this.image_class+"' >").css({"left": srcx, "top" : srcy, '-moz-transform':'rotate('+degrees+'deg)',
							 '-webkit-transform':'rotate('+degrees+'deg)',
							 '-o-transform':'rotate('+degrees+'deg)',
							 '-ms-transform':'rotate('+degrees+'deg)',
							 'transform':'rotate('+degrees+'deg)'});
		$(document.body).append($div)
		this.move_projectile(desx, desy)
		
		//5 px per speed (250ms)
		
	}
	
	move_projectile(desx, desy) {
		var projectile_gui_location = $("#"+this.id);
		var step = 5;
		var src_x = parseInt(projectile_gui_location.css("left"));
		var src_y = parseInt(projectile_gui_location.css("top"));
		var deg = Math.atan2(desy - src_y, desx - src_x) * 180 / Math.PI; //degrees
		
		var move_x = Math.cos(deg) * step
		var move_y = Math.pow(step, 2) - Math.pow(move_x, 2)

		this.mytimer = new Timer(() => {	
			projectile_gui_location.css({"left": (src_x - move_x), "top": (src_y - move_y) });
			
			this.move_projectile(elem_id, speed, desx, desy)
			
		}, this.speed);
	
	}
	
	remove() {
		try {
		//this.stop_animation = true;
		//this.timer.stop();
		$("#"+this.id).remove();
		}
		catch (error) {
			if (debug) {
				console.log(error)
			}
		//	console.log("unable to remove item", remove_error);
		}
	}
	
	

	
	
}