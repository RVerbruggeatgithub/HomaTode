class Flame extends Weapon {
	constructor() {
		super();

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



		var projectile_id = generate_unique_id("projectile_")
		this.id = projectile_id
		var me = this;
			var $div = $("<div>", {"class": this.css_class}).css({"left": this.spawn_x, "top" : this.spawn_y, '-moz-transform':'rotate('+degrees+'deg)',
								 '-webkit-transform':'rotate('+degrees+'deg)',
								 '-o-transform':'rotate('+degrees+'deg)',
								 '-ms-transform':'rotate('+degrees+'deg)',
								 'transform':'rotate('+degrees+'deg)'}).animate({ left: this.target_x, top: this.target_y}, this.rof).fadeOut(100, function() {
				me.hit(me.opponent, me.target_x, me.target_y)
				$(this).remove(); 
				})
		$(document.body).append($div)
		

	}

	
	hit(target, x, y) {
		var $div = $("<div><img src='images/boom2.gif' height='25' width='25' />", {"class": "Explosion_1"}).css({"left": x, "top" : y, "position" : "absolute"	}).fadeOut(1250, function() {
			$(this).remove(); 
		})
		$(document.body).append($div)
		var me = this;
		
			$( ".unit" ).each(function( index ) {
				
				try {
					var target_gui_location = $("#"+this.id);
					var target_x = parseInt(target_gui_location.css("left"));
					var target_y = parseInt(target_gui_location.css("top"));
					var cur_opponent = units[this.id] === undefined ? null : units[this.id];
					if (cur_opponent != null && cur_opponent.id == target.id) {										
						//Regular damage

						target.update_hp(me.damage)
						update_gui()

					}
					else {
						
						var check_distance = calcDistanceByCoordinates(x, y, target_x, target_y)
						var splash_damage_per_distance = me.max_splash_damage / me.max_splash_range											
						if (check_distance <= me.max_splash_range) {
						//The closer the unit to the source 'explosion' the more damage.
							var resulting_damage = Math.round(((me.max_splash_range - check_distance) + 1) * splash_damage_per_distance)
							//cur_opponent.hp -= resulting_damage
							cur_opponent.update_hp(resulting_damage)
							update_gui()

							
						}
					}
				}
				catch (error) {
					if (debug) {
						console.log(error)
					}
				}
				
			});
	
		
	}
}