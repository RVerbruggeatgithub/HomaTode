//https://www.samanthaming.com/tidbits/70-3-ways-to-clone-objects/  Cloning objects.. may be needed

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function pointDirection(x1, y1, x2, y2, radians = false) {
	if (radians) {
		 return Math.atan2(y2 - y1, x2 - x1)
	}
	else {
		return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
	}
}

function between(x, min, max) {
  return x >= min && x <= max;
}

function lineDraw(ax, ay, bx, by, line_width) {
    if(ax > bx) {
        bx = ax + bx; 
        ax = bx - ax;
        bx = bx - ax;

        by = ay + by;
        ay = by - ay;
        by = by - ay;
    }

    var distance = Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
    var calc = Math.atan((by - ay) / (bx - ax));
    var degrees = calc * 180 / Math.PI;
	var $div = $("<div>", {"class": "laser_1"}).css({
        position: 'absolute',
        height: (line_width/5 + 1)+'px',
        transformOrigin: 'top left',
        width: distance,
        top: ay + 'px',
        left: ax + 'px',
		'-moz-transform':'rotate('+degrees+'deg)',
		 '-webkit-transform':'rotate('+degrees+'deg)',
		 '-o-transform':'rotate('+degrees+'deg)',
		 '-ms-transform':'rotate('+degrees+'deg)',
		 'transform':'rotate('+degrees+'deg)',
        backgroundColor: "red",
    }).fadeOut(150, function() {
								$(this).remove(); 
								})
	$(document.body).append($div)
}

function sortObj(obj) {
   return Object.keys(obj).sort((a, b) => 0.5 - Math.random()).reduce(function(result, key) {
      result[key] = obj[key];
      return result;
   }, {});
}



function calcDistance(tower, unit) {
	// Calculate the distance from the closest edge of the element
	// to the cursor's current position
	
	var left, right, top, bottom, offset,
		cX, cY, dX, dY,
		distance = 0;
	tower = $("#"+tower);
	unit = $("#"+unit);
	try {
		tower_offset = tower.offset();
		tower_left = tower_offset.left;
		tower_top = tower_offset.top;
		tX = tower_left + (tower.outerWidth() / 2);
		tY = tower_top + (tower.outerHeight() / 2);
		
		unit_offset = unit.offset();
		unit_left = unit_offset.left;
		unit_top = unit_offset.top;
		uX = unit_left + (unit.outerWidth() / 2);
		uY = unit_top + (unit.outerHeight() / 2);
		
		dX = tX - uX;
		dY = tY - uY;
	
		return Math.sqrt( dX * dX + dY * dY );	
	}
	catch(err) {
		//The unit is already destroyed..
		return 10000;
	}
}

function calcDistanceByCoordinates(x1, y1, x2, y2) {
	// Calculate the distance from the closest edge of the element
	// to the cursor's current position
	
	var left, right, top, bottom, offset,
		cX, cY, dX, dY,
		distance = 0;
	
	tower_left = x1;
	tower_top = y1;
	tower_right = x1;
	tower_bottom = y1;
	
	unit_left = x2;
	unit_top = y2
	unit_right = x2;
	unit_bottom = y2;
	
	cX = unit_left > tower_right ? tower_right : unit_right > tower_left ? unit_right : tower_left;
	cY = unit_top > tower_bottom ? tower_bottom : unit_bottom > tower_top ? unit_bottom : tower_top;
	
	dX = Math.abs( cX - unit_left );
	dY = Math.abs( cY - unit_top );
	
	return Math.sqrt( dX * dX + dY * dY );	
}

function set_tower_type(tower_type) {
	tower_type = tower_type;
}

function pause_battlefield(){
	for (var i = 0; i < wavetimers.length; i++)
	{
		wavetimers[i].pause();
	}
}

function resume_battlefield(){
	for (var i = 0; i < wavetimers.length; i++)
	{
		wavetimers[i].resume();
	}
}


function unload_battlefield(){
	//Stop wave timer
	rungame = false;
	Banked = 0;
	
	for (var i = 0; i < wavetimers.length; i++)
{
		wavetimers[i].stop();
	}
	wavetimers = [];
	//clear units
	$( ".unit" ).each(function( index ) {
		$(this).remove()
	});
	units = []
	
	//remove goal
	$( ".enemy_goal" ).remove();
	
	//clear towers
	$( ".tower_base" ).each(function( index ) {
		$(this).remove()
	});
	towers = []
	
	//clear platforms
	$( ".allow_build" ).each(function( index ) {
		$(this).remove()
	});
	
	//In case the tower upgrade dialogue box is open
	$( "#dialog-message" ).dialog( "close" );
	
	//clear debug nodes
	if (debug) {
		$( ".node" ).each(function( index ) {
			$(this).remove()
		});
	}
	waves_process = 0;
	total_enemy_count = 0;
	enemies_killed = 0;
	enemies_passed = 0;
	enemies_removed = 0;
}

function newGame() {	
	rungame = false;
	openNav('m0')
	lives = 0;
	Banked = 0;
	level = 0;
	unload_battlefield()
	new Timer(() => {	
			unload_battlefield()
			load_battlefield(null, null, null)
			//run_wave(enemies.get(wave.type), wave.group_size, start_location)
			openNav('m1')
			hideNav()
			$("#start_level").show()
			$(".menu_bar").show()
	}, 1500);
}

function nextLevel() {
	//(set_level = 0, set_lives = 25, set_cash = 1200)
	level++;
	max_bonus = 10; //percent
	set_bonus = ((lives / 25) * max_bonus/100)* Banked
	bonus_cash = Math.round(set_bonus)
	console.log(lives)
	new Timer(() => {	
			unload_battlefield()
			console.log(lives)
			load_battlefield(level, lives, bonus_cash)
			//run_wave(enemies.get(wave.type), wave.group_size, start_location)
			openNav('m1')
			hideNav()
			$("#start_level").show()
			$(".menu_bar").show()
	}, 1500);
}

function load_battlefield(set_level = 0, set_lives = 25, set_cash = 1200){
	
	lives = (set_lives == null) ? 25 : set_lives;
	level = (set_level == null) ? 0 : set_level;
	Banked = (set_cash == null) ? levels[level].cash : (levels[level].cash + set_cash);
	update_gui()
	
	level_start_location = levels[level].start
	level_max_wave = levels[level].wave.length;
	
	path_length = levels[level].path.length;
	end_location = levels[level].path[path_length- 1]
	var $div = "<div class='enemy_goal' id='goal"+this.level+"' style='position:absolute;left: "+(end_location.x-100)+"px;top: "+(end_location.y-125)+"px; width: 200px; height: 200px; padding-bottom: 150px '><div class='blackhole'><img src='images/black_hole.png' height=200; width=200; /></div></div>"
	$(document.body).append($div)

//setup mode: comment below out to hide path:
	if (debug) {
		var $div = "<div class='node' id='node_0' style='position:absolute;left: "+(level_start_location.x-25)+";top: "+level_start_location.y+"; width: 50px; height: 50px; background-color: #999999'></div>"
		$(document.body).append($div)
		for (var path_node = 0; path_node <= (path_length-1); path_node++) {
			node_index = path_node + 1;
			node = levels[level].path[path_node]
			var $div = "<div class='node' id='node_"+node_index+"' style='position:absolute;left: "+(node.x-25)+";top: "+(node.y-25)+"; width: 50px; height: 50px; background-color: #999999'>Node:"+node_index+"</div>"
		$(document.body).append($div)
		}
	}
	
	var platforms = levels[level].platforms.length
	for (var platform = 0; platform <= (platforms-1); platform++) {
			current_platform = levels[level].platforms[platform]
			contents = debug ? current_platform.x+","+current_platform.y+", W"+current_platform.width+", H"+current_platform.height+" Platform:"+platform : "";
			
			pf_tl = "<div class='platform_tl allow_build' style='position:absolute;left: "+(current_platform.x-25)+"px;top: "+(current_platform.y-25)+"px; width: 25px; height: 25px;'></div>"
			pf_t = "<div class='platform_t allow_build' style='position:absolute;left: "+(current_platform.x)+"px;top: "+(current_platform.y-25)+"px; width: "+(current_platform.width)+"px; height: 25px;'></div>"
			pf_tr = "<div class='platform_tr allow_build' style='position:absolute;left: "+(current_platform.x+current_platform.width)+"px;top: "+(current_platform.y-25)+"px; width: 25px; height: 25px;'></div>"
			pf_l = "<div class='platform_l allow_build' style='position:absolute;left: "+(current_platform.x-25)+"px;top: "+(current_platform.y)+"px; width: 25px; height: "+(current_platform.height)+"px;'></div>"
			pf_r = "<div class='platform_r allow_build' style='position:absolute;left: "+(current_platform.x+current_platform.width)+"px;top: "+(current_platform.y)+"px; width: 25px; height: "+(current_platform.height)+"px;'></div>"
			pf_bl = "<div class='platform_bl allow_build' style='position:absolute;left: "+(current_platform.x-25)+"px;top: "+(current_platform.y+current_platform.height)+"px; width: 25px; height: 25px;'></div>"
			pf_b = "<div class='platform_b allow_build' style='position:absolute;left: "+(current_platform.x)+"px;top: "+(current_platform.y+current_platform.height)+"px; width: "+(current_platform.width)+"px; height: 25px;'></div>"
			pf_br = "<div class='platform_br allow_build' style='position:absolute;left: "+(current_platform.x+current_platform.width)+"px;top: "+(current_platform.y+current_platform.height)+"px; width: 25px; height: 25px;'></div>"
			
			var $div = pf_tl + pf_t+ pf_tr + pf_l + pf_r + pf_bl + pf_b + pf_br +"<div class='platform allow_build' style='position:absolute;left: "+(current_platform.x)+"px;top: "+(current_platform.y)+"px; width: "+(current_platform.width)+"px; height: "+(current_platform.height)+"px;'>"+contents+"</div>"
			
			$(document.body).append($div)
		}

}



function set_wave(wave, start_location) {
	wave_delay_in_seconds = wave.delay * 1000;
	waveTimer = new Timer(() => {	
			MessageOutput("Our radar has detected incoming  "+ wave.type)
			total_enemy_count += wave.group_size
			run_wave(enemies.get(wave.type), wave.type, wave.group_size, start_location)
			
			waves_process++;
	}, wave_delay_in_seconds);
	//wavetimers.push(waveTimer);
	/*
	setTimeout(() => {
		MessageOutput("Our radar has detected incoming  "+ wave.type)
		run_wave(enemies.get(wave.type), wave.group_size)
	}, wave_delay_in_seconds);
	*/
}

function run_wave(opponents, enemy_type, size, start_location) {
	for (var n = 0; n < size; n++) {
	
		var max_timx = (size * opponents.attraction) + 100;
		
		var timx = getRndInteger(100, max_timx)
		
		var ynx = new Timer(() => {
				
			
			var x_adj = getRndInteger(-10, 10);
			var y_adj = getRndInteger(-10, 10);
			var tmp_start_locationx = start_location.x + x_adj
			var tmp_start_locationy = start_location.y + y_adj
			switch (enemy_type) {	
				case "Azaries":
					t = new Azaries();
					break;
				case "Darloki":
					t = new Darloki();
					break;
				case "Earanours":
					t = new Earanours();
					break;	
				case "Valcheraks":
					t = new Valcheraks();
					break;	
				case "Gurhabs":
					t = new Gurhabs();
					break;	
				case "Tharak":
					t = new Tharak();
					break;						
				default:
					console.log("Enemy ", enemy_type, " does not exist!")
					break;	
			}
			
			t.construct_unit(generate_unique_id("obj_"), tmp_start_locationx, tmp_start_locationy, x_adj, y_adj, opponents.tile, opponents.abilities); 
			
			t.create();
			units[t.id] = t;
			t.set_path(levels[level].path);

			t.run();
			
		}, timx);
		
		//wavetimers.push(ynx);		
	}
	level_wave++
}

var Timer = function(callback, delay) {
	var timerId, start, remaining = delay;

	this.pause = function() {
		window.clearTimeout(timerId);
		//remaining -= Date.now() - start;
	};

	this.resume = function() {
		start = Date.now();
		window.clearTimeout(timerId);
		timerId = window.setTimeout(callback, remaining);
	};
	
	this.stop = function() {
		window.clearTimeout(timerId);
	}

	this.resume();
};

function	generate_unique_id(prefix) {
	return prefix+""+getRndInteger(10000, 1000000); 
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


function get_level_details(waves, data) {
	var output = [];
	var enemie_list = [];
	
	for (var w = 0; w < waves.length; w++){		
		if (!enemie_list.includes(waves[w].type)) {
			enemie_list.push(waves[w].type)
			
			var unit_data = data[waves[w].type]
//		data[waves[w]]
		output.push(unit_data.get_enemy_details_as_html());

		
		unit_data.remove();
		}

		

	}
	return output.join(",");
	
}



function linear_extrapolate(x1, y1, x2, y2) {

	var dx = (x1 - x2) * -1;
	var dy = (y1 - y2) * -1;
	var ex = 0;
	var ey = 0;
	
	var slope = dx / dy
	if (dx > 0) { 
	   ex = window.innerWidth;
	}
	else {
	   ex = 0
	}

	if (dy > 0) {
	   ey = window.innerHeight;
	}
	else {
	   ey = 0
	}
	
	//check for horizontal/vertical lines 
	if (dx == 0) {
		return {"x" : x1, "y": ey}
	}
	if (dy == 0) {
		return {"x" : y1, "y" : ex}
	}
	
	var tx = (ex - x1) / dx
	var ty = (ey - y1) / dy

	//and get intersection for smaller parameter value
	if (tx <= ty) {
	   cx = ex
	   cy = y1 + tx * dy
	}
	else {
	   cy = ey
	   cx = x1 + ty * dx
	}
	return {"x" : cx, "y" : cy}
}

