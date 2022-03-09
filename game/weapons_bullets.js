class Bullet extends Weapon {
	constructor() {
		super();
		this.accuracy = 18;
		this.weapon_timing = 1200;
		this.step = 25; //the lower this number the slower the projectile goes :: Maximum distance/hypotenuse
	}
	
	action() {
	
		
		var spawn_center_x = this.spawn_x + 5;
		var spawn_center_y = this.spawn_y + 5;
		 
		if (this.opponent !== undefined) {
		
			var target_center_x = parseInt($("#"+this.opponent.id).css("left")) + (parseInt($("#"+this.opponent.id).css("width")) / 2);
			var target_center_y = parseInt($("#"+this.opponent.id).css("top")) + (parseInt($("#"+this.opponent.id).css("height")) / 2);
			
			var degrees = 0;
			if (this.directional) {
				var degrees = pointDirection(spawn_center_x, spawn_center_y, target_center_x, target_center_y)
			}
			
			var projecttile_exit = linear_extrapolate(spawn_center_x, spawn_center_y, target_center_x, target_center_y)
			var projectile_id = generate_unique_id("projectile_")
			this.id = projectile_id

			var $div = $("<div id='"+projectile_id+"' class='"+this.css_class+"'>").css({"left": spawn_center_x, "top" : spawn_center_y, '-moz-transform':'rotate('+degrees+'deg)',
								 '-webkit-transform':'rotate('+degrees+'deg)',
								 '-o-transform':'rotate('+degrees+'deg)',
								 '-ms-transform':'rotate('+degrees+'deg)',
								 'transform':'rotate('+degrees+'deg)'})
								 
			$(document.body).append($div)
			var delta_x =  target_center_x - spawn_center_x;
			var delta_y = target_center_y- spawn_center_y;

			var distance = Math.sqrt(delta_x * delta_x + delta_y * delta_y) // the hypotenuse
			//var x_modifier = delta_x / Math.abs(delta_x);
			var y_modifier = delta_y / Math.abs(delta_y); //Arctangent give postive numbers in Q1 and Q2 but negative in Q3 and Q4, need to account for this
			var slopeAngle = pointDirection(target_center_x, target_center_y, spawn_center_x, spawn_center_y, false) * y_modifier //Getting angle in degrees
			slopeAngle = slopeAngle * 0.0174532925 //conversion rate to radians 
			var new_move_x = this.step *  -Math.cos(slopeAngle) //calculate the X distance if the hypotenuse = step, using Angle of the slope (slopeAngle)
			var new_move_y = this.step *  Math.sin(slopeAngle) * -1 * y_modifier //calculate the Y distance if the hypotenuse = step, using Angle of the slope (slopeAngle)
			//new_move_x = isNaN(new_move_x) ? 0 : new_move_x; 
			//new_move_y = isNaN(new_move_y) ? 0 : new_move_y;	
			var me = this;
		//	console.log("(", new_slope, ")", "Move x:",move_x, "(", new_move_x, ")", "Move y:",move_y, "(", new_move_y, ")",  old_factor, new_factor, x_modifier, y_modifier)
			var count = 0;
			animate({
			  duration: me.weapon_timing,
			  timing: linear,
			  draw: function(progress) {		
				var projectile_gui_location = $("#"+projectile_id); 
				var src_x_ = parseInt(projectile_gui_location.css("left"));
				var src_y_ = parseInt(projectile_gui_location.css("top"))
				var move_left = src_x_ + new_move_x;
				var move_top = src_y_ + new_move_y;

				count++;
				projectile_gui_location.css({"left": move_left, "top" : move_top})
				var result = me.check_touch(move_left, move_top);

				if (result.hit) {

					let requestId = requestAnimationFrame(animate)
					cancelAnimationFrame(requestId);
					projectile_gui_location.remove();
					me.hit(result.target, move_left, move_top)
				}	
			  },
				complete: function(progress) {

					var projectile_gui_location = $("#"+projectile_id); 
					let requestId = requestAnimationFrame(animate)
					cancelAnimationFrame(requestId);
					projectile_gui_location.remove();
				},
				pause: function(){ //not sure if this will work yet
					if (pause_game) {
						return true;
					}
					else {
						return false;
					}
				}
			});
		}
	}


	check_touch(src_x, src_y){
			var result = {"hit" : false, "target" : null}
			var me = this;
			$( ".unit" ).each(function( index ) {
				var target_gui_location = $("#"+this.id);
				var target_x_ = parseInt(target_gui_location.css("left"));
				var target_y_ = parseInt(target_gui_location.css("top"));
				var target_x = target_x_ +(parseInt(target_gui_location.css("width"))/2);
				var target_y = target_y_ +(parseInt(target_gui_location.css("height"))/2);
				var cur_opponent = units[this.id] === undefined ? null : units[this.id];					
				var check_distance = calcDistanceByCoordinates(src_x, src_y, target_x, target_y)		
				if (check_distance <=  me.accuracy) {			
					result = {"hit" : true, "target" : cur_opponent}
					return result;
				}
			});
			return result;	
	}
	
	
	hit(target, x, y) {
		/*
		var $div = $("<div><img src='images/boom.gif' height='25' width='25' />", {"class": "Explosion_1"}).css({"left": x, "top" : y, "position" : "absolute"	}).fadeOut(1250, function() {
			$(this).remove(); 
		})
		$(document.body).append($div)
		*/
		var me = this;

		target.update_hp(this.damage)  

		update_gui()
		this.remove();
	}
}