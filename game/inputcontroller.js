$(function () {
	$("#start_level").click(function(){
		if (mode == "regular") {
			rungame = true;
			run_level(levels[level])
		}
		else {
			rungame = true;
			run_unlimited();
		}
		$(this).hide();
	});
	

	
	
	$(".modal").on("click", ".open_research", function(){
		$("#research_menu").show()
		$("#tower_menu").css({"display": "none"})
		myTower = null;
		$( ".Highlight_Tower" ).each(function( index ) {
			$(this).removeClass("Highlight_Tower")
		});
		$('.follower').css({'display' : 'none'})
	});
	
	$("#close_research_menu").click(function(){
		$("#research_menu").hide()
	});
	
	
	
	
	$("#pause").click(function(){
		if (pause_game) {
			pause_game = false;
			$(this).toggleClass("btn_start_continue")
			$(this).toggleClass("btn_pause")
		}
		else {
			pause_game = true;
			$(this).toggleClass("btn_start_continue")
			$(this).toggleClass("btn_pause")
		}
	})	
	
	$(".research_option").click(function(){
		//research_level
		//branch_4
		var selected_branch = $(this).attr("research_branch")
		factor = (Math.floor(research_level / 5) + 1);
		cost = 50 * factor;
		if (Banked >= cost && research_level < max_research_level && selected_branch == factor) {
			Banked -= cost;
			update_gui();
			research_level += 1;
			factor = (Math.floor(research_level / 5) + 1);
	//$( ".Highlight_Tower" ).each(function( index )		
			$(".progress_circle").each(function( index ) {  
				
				if(index < (factor-1)) {  
					$(this).addClass('active')  
					var my_selector = index + 2;
					console.log("#branch_"+my_selector);
					$("#branch_"+my_selector).addClass("avail")
				} 

			})
			update_branch_counter = factor;
			cur_branch_level = ((research_level-1) % 5) +1;
			update_branch_counter = (cur_branch_level == 5) ? (factor -=1) : update_branch_counter;
			$("#branch_"+update_branch_counter).text(cur_branch_level+"/5")

			update_research(update_branch_counter, cur_branch_level)
			var research_completion_percentage = ((research_level) / max_research_level) * 100
			var width = research_completion_percentage+"%"
			$('#progress').css({ "width" : width});
			
		   }
	})

	
	$('#debug').click(function() {
        if($(this).is(':checked')) {
            debug = true;
		}			
        else {
            debug = false;
		}
    });
	
	$('#show_path').click(function() {
        if($(this).is(':checked')) {
            enable_travel_path = true;
			q = (mode == "unlimited") ? reveal_path(unlimited_level) : reveal_path(levels[level]);
		}
        else {
            enable_travel_path = false;
			hide_path()
		}
    });
	
	$("#config_wave_timer").on("input", function(){
		time_between_waves = parseInt(this.value)
		$(this).attr("data-after", this.value)
	})	
	
	
	$("#config_startcash").on("input", function(){
		config_startcash = parseInt(this.value)
		$(this).attr("data-after", this.value)
	})	
	
	
	$("#config_lives").on("input", function(){
		start_lives = parseInt(this.value)
		$(this).attr("data-after", this.value)
	})	
	
	$("#config_runtime").on("input", function(){
		runtime = parseInt(this.value)
		$(this).attr("data-after", this.value)
	})	
	
	$( "#map_select" ).change(function() {
		var index = $( this ).val();	
		unlimited_level = unlimited_levels[index];
	});
	
})

$(document).bind('mousemove', function(e){
	valid = true;
	x = parseInt($(".follower").css("left"))
	y = parseInt($(".follower").css("top"))
	s = $(".follower").width()
	if (debug) {
		$('.follower').text(x +", "+y+", "+s)
	}
	
		
	//if the tower base is 4 squares, need to make sure the other 3 squares are on a valid location.
	boundery = s - 25;
	if (s > 25) {
		try {
			x_adjust = $(document).scrollLeft()
			y_adjust = $(document).scrollTop();
			var touch_points = 0;
			if (!isNaN(x) || !isNaN(y)) {
				qelement = $(document.elementFromPoint(x + boundery -x_adjust , y - y_adjust))
				if (qelement.hasClass('allow_build')) {
					touch_points++;
				}
						
				qelement = $(document.elementFromPoint(x -x_adjust, y + boundery - y_adjust)) //bottom of current element
				if (qelement.hasClass('allow_build')) {
					touch_points++;
				}
			
				qelement = $(document.elementFromPoint(x +boundery -x_adjust, y +boundery - y_adjust)) //right bottom of current element
				if (qelement.hasClass('allow_build')) {
					touch_points++;
				}
			}
			
			
			if (touch_points == 3) {
				valid = true;
			}
			else {
				valid = false;
			}
		}
		catch (error) {
			if (debug) {
				console.log(error)
			}
			valid = false;
		}
	}
	

	if (tower_type != null) {	
			if ($(e.target).hasClass('allow_build') && valid) { //Enabled
			$('.follower').css({
			 top: Math.round((e.pageY - $(".follower").height()/2) / 25) * 25, // just minus by half the height
			 left:  Math.round((e.pageX - $(".follower").width()/2) / 25) * 25, // just minus by half the width
			 width: tower_icon_follower_size,
			 height: tower_icon_follower_size,
			'background-color': 'rgba(44, 103, 0, .5)',
			'position': 'absolute',
			'z-index' : 500,
			'pointer-events' : 'none',
			'display' : 'block',
			});
		}
		else {  //Disabled
			$('.follower').css({
			 top: Math.round((e.pageY - $(".follower").height()/2) / 25) * 25, // just minus by half the height
			 left:  Math.round((e.pageX - $(".follower").width()/2) / 25) * 25, // just minus by half the width
			 width: tower_icon_follower_size,
			 height: tower_icon_follower_size,
			'background': 'rgba(170,1,20, .5)',
			'position': 'absolute',
			'z-index' : 500,
			'pointer-events' : 'none',
			'display' : 'block',
			});
		}
	}
	else {
		$('.follower').css({'display' : 'none'})
	}
 });


/*
Tower highlight
*/
$(document).on('mousedown','.tower_base, .tower_base_2',function(ev){
	//Highlight_Tower
	$( ".Highlight_Tower" ).each(function( index ) {
		$(this).removeClass("Highlight_Tower")
	});
	$(this).toggleClass("Highlight_Tower");
	selected_tower = $(this).attr('id');
	$("#upgrade").removeClass("action_button_disabled")
	selected_tower = towers[selected_tower];
	tower_x = Math.round(parseInt($(this).css("left")) + 50)
	tower_y = Math.round(parseInt($(this).css("top")))	
	$(".modal_details").html(selected_tower.get_tower_details_as_html());
	
	if (selected_tower.level >= 5 && !level_6_tower) {
		$("#upgrade").addClass("action_button_disabled")
	}
	
	if (selected_tower.level >= 6) {
		$("#upgrade").addClass("action_button_disabled")
	}
	$("#tower_menu").css({"display": "block", "left" : tower_x, "top": tower_y, "z-index" : 11})
	myTower = selected_tower.id;
});

$(document).on('mousedown','.close',function(ev) {
	$("#tower_menu").css({"display": "none"})
	myTower = null;
	$( ".Highlight_Tower" ).each(function( index ) {
		$(this).removeClass("Highlight_Tower")
	});
});

$(document).on('mousedown','#upgrade',function(ev) {
	$("#upgrade").removeClass("action_button_disabled")
	
	if (towers[myTower].level < 5 && !level_6_tower) {
		towers[myTower].upgrade();
		$(".modal_details").html(selected_tower.get_tower_details_as_html());
	
	}
	
		
	if (towers[myTower].level < 6 && level_6_tower) {
		towers[myTower].upgrade();
		$(".modal_details").html(selected_tower.get_tower_details_as_html());
	
	}
	
	if (towers[myTower].level >= 5 && !level_6_tower) {
		$("#upgrade").addClass("action_button_disabled")
	}
	
	if (towers[myTower].level >= 6 && level_6_tower) {
		$("#upgrade").addClass("action_button_disabled")
	}
});

$(document).on('mousedown','#sell',function(ev){
	towers[myTower].sell();
});


$(document).on('mousedown','.menu_item',function(ev){
	$( ".menu_item" ).each(function( index ) {
		$(this).removeClass("Highlight_MenuItem")
	});					
	tower_type = $(this).attr("tower_type");
	$(this).toggleClass("Highlight_MenuItem")
	var tower = get_tower(tower_type);
	tower.construct_tower(0, 0, "#543AAF"); 
	//Adjust the size of the square that follows the mouse movement.
	tower_icon_follower_size = tower.size;	
});

$(document).on('mousedown', function(ev){
	switch (ev.which) {
		case 3:
			tower_type = null;
			$( ".Highlight_Tower" ).each(function( index ) {
				$(this).removeClass("Highlight_Tower")
			});
			$( ".menu_item" ).each(function( index ) {
				$(this).removeClass("Highlight_MenuItem")
			});
			$('.follower').css({'display' : 'none'})
            break;
		default:
            break;
	}
});

$(document).on('mousedown', ".allow_build", function(ev){
    switch (ev.which) {
        case 1:
				valid = true;
				if (tower_type == null) {
					return;
				}
				var _x = ev.pageX
				var _y = ev.pageY
				_x = Math.floor(_x / 50) * 50
				_y =  Math.floor(_y / 50) * 50
				
				var match = false;

				__x = parseInt($(".follower").css("left") + $(document).scrollTop()) 
				__y = parseInt($(".follower").css("top") + $(document).scrollTop())	
			
				$( ".tower_base" ).each(function( index ) {
					tower_x = Math.round(parseInt($(this).css("left")))
					tower_y = Math.round(parseInt($(this).css("top")))		  
					if (tower_x == __x && tower_y == __y) {
						match = true;
						return;
					}
				});

				if (!match) {			
					var tower = get_tower(tower_type);
					tower.construct_tower(__x, __y, "#543AAF"); 
					boundery = s - 25;
					if (s > 25) {
						x_adjust = $(document).scrollLeft()
						y_adjust = $(document).scrollTop();
						var touch_points = 0;
						element = $(document.elementFromPoint(x + boundery -x_adjust , y - y_adjust))
						if (element.hasClass('allow_build')) {
							touch_points++;
						}
								
						element = $(document.elementFromPoint(x -x_adjust, y + boundery - y_adjust)) //bottom of current element
						if (element.hasClass('allow_build')) {
							touch_points++;
						}
					
						element = $(document.elementFromPoint(x +boundery -x_adjust, y +boundery - y_adjust)) //right bottom of current element
						if (element.hasClass('allow_build')) {
							touch_points++;
						}
						
						
						
						if (touch_points == 3) {
							valid = true;
						}
						else {
							valid = false;
						}
					}
	
	
					if (tower.price[0] <= Banked && valid) {
						Banked -= tower.price[0]
						update_gui()
						towers[tower.id] = tower;
						tower.create();	
						tower.idle();
					}
					else {
						console.log("Insufficient funds", tower.price[0])

					}
				}
				else {
					console.log("cannot build tower there!")
				}
            break;
        case 2:
			tower_type = null;
            break;
        case 3:
			
            break;
        default:
            break;
    }
	
});