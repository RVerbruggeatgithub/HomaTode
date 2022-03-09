/*
	 Create new object of type tower_type.
	 (string) tower_type = name of Tower
	 returns (obj) Tower object [extended by tower_type]
*/
function get_tower(tower_type) {
	let towertypes = {
		"MinigunTower" : new MinigunTower(),
		"RocketTower" : new RocketTower(),
		"LaserTower" : new LaserTower(),
		"FlamethrowerTower" :new FlamethrowerTower(),
		"PhotonTower" : new PhotonTower(),
		"CannonTower" : new CannonTower(),
		"SonicTower" : new SonicTower(),
		"ResearchFacility" : new ResearchFacility(),
	}
	return towertypes[tower_type];
}

/*
	 Get a random integer between min and max.
	 (int) min = minimum number
	 (int) max = maximum number
	 returns (int) random number
*/
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}


/*
	Returns the angle of the line in degrees or radians
	(int) x1 = source x location
	(int) y1 = source y location
	(int) x2 = destination x location
	(int) y2 = destination y location
	returns (double) radians (true) | degrees (false)
*/
function pointDirection(x1, y1, x2, y2, radians = false) {
	if (radians) {
		 return Math.atan2(y2 - y1, x2 - x1)
	}
	else {
		return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
	}
}

/*
	 Check if number provided is between min and max (inclusive)
	 (int) x = number to compare
	 (int) min = minimum number
	 (int) max = maximum number
	 returns (boolean)
*/
function between(x, min, max) {
  return x >= min && x <= max;
}

/*
	 Draw a line from [ax,ay] to [bx,by]
	 (int) ax = source x location
	 (int) ay = source y location
	 (int) bx = destination x location
	 (int) by = destination y location
	 (int) optional line_width, defaults to 1
	 creates element on screen.
*/
function lineDraw(ax, ay, bx, by, line_width = 1) {
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


/*
	Calculate the distance from the center of a tower [element] to center of unit [element]
	(string) tower = html element of a tower (e.g. $("tower_xxx"))
	(string) unit = html element of a unit (e.g. $("unit_xxx"))
	returns (int) distance in pixels
*/
function calcDistance(tower, unit) {

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
		if (unit.length > 0) {
			unit_offset = unit.offset();
			unit_left = unit_offset.left;
			unit_top = unit_offset.top;
			uX = unit_left + (unit.outerWidth() / 2);
			uY = unit_top + (unit.outerHeight() / 2);
			
			dX = tX - uX;
			dY = tY - uY;
		
			return Math.sqrt( dX * dX + dY * dY );	
		}
		else {
			return 10000;
		}
	}
	catch(error) {
		//The unit is already destroyed..
		if (debug) {
				console.log(error)
		}
		return 10000;
	}
}

/*
	Calculate the distance between two coordinate sets
	(int) x1 = source x location
	(int) y1 = source y location
	(int) x2 = destination x location
	(int) y2 = destination y location
	returns (int) distance in pixels
*/
function calcDistanceByCoordinates(x1, y1, x2, y2) {
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


/*
	Removes all non-GUI elements from the field and resets their respective arrays.
	Sets variables back to 0
*/	
function unload_battlefield(){
	//Stop wave timer
	rungame = false;
	Banked = 0;

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
	
	theme_body = theme+"_body"; 
	
	$('[class$=_body]').removeClass()
	
	$(".structure_base_1").remove();
	$(".structure_base_2").remove();
	research_level = 0;
	enemies_increased_damage_recieved_percentage = 0;
	cash_bonus_percentage = 0;
	level_6_tower = false;
	cannontower_bonus_damage = 0;
	cannontower_bonus_splash_damage = 0;
	
	hide_path();
}

function newGame() {	
	rungame = false;
	openNav('m0')
	lives = 0;
	Banked = 0;
	level = 0;
	mode = "regular";
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

function newU_Game() {	
	rungame = false;
	openNav('m0')
	lives = 25;
	Banked = 0;
	level = 0;
	mode = "unlimited";
	unload_battlefield()
	new Timer(() => {	
			unload_battlefield()
			loadU_battlefield(25, 1200)
			//run_wave(enemies.get(wave.type), wave.group_size, start_location)
			openNav('m1')
			hideNav()
			$("#start_level").show()
			$(".menu_bar").show()
	}, 1500);
}

/*
	Loads all non-GUI elements from the level data into the field for Unlimited game mode
	Sets level parameters
*/	
function loadU_battlefield(){
	
		
	lives = start_lives;
	Banked = config_startcash;
	update_gui()
	
	level_start_location = unlimited_level.start
	
	theme_body = theme+"_body"; 
	$('body').addClass(theme_body)
	
	path_length = unlimited_level.path.length;
	end_location = unlimited_level.path[path_length- 1]
	var $div = "<div class='enemy_goal' id='goal"+this.level+"' style='position:absolute;left: "+(end_location.x-100)+"px;top: "+(end_location.y-125)+"px; width: 200px; height: 200px; padding-bottom: 150px '><div class='blackhole'><img src='images/black_hole.png' height=200; width=200; /></div></div>"
	$(document.body).append($div)

//setup mode: comment below out to hide path:
	if (debug) {
		var $div = "<div class='node' id='node_0' style='position:absolute;left: "+(level_start_location.x-25)+";top: "+level_start_location.y+"; width: 50px; height: 50px; background-color: #999999'></div>"
		$(document.body).append($div)
		for (var path_node = 0; path_node <= (path_length-1); path_node++) {
			node_index = path_node + 1;
			node = unlimited_level.path[path_node]
			var $div = "<div class='node' id='node_"+node_index+"' style='position:absolute;left: "+(node.x-25)+";top: "+(node.y-25)+"; width: 50px; height: 50px; background-color: #999999'>Node:"+node_index+"</div>"
		$(document.body).append($div)
		}
	}
	
	var platforms = unlimited_level.platforms.length
	for (var platform = 0; platform <= (platforms-1); platform++) {
			current_platform = unlimited_level.platforms[platform]
			contents = debug ? current_platform.x+","+current_platform.y+", W"+current_platform.width+", H"+current_platform.height+" Platform:"+platform : "";
			
			pf_tl = "<div class='"+theme+"_platform_tl allow_build' style='position:absolute;left: "+(current_platform.x-25)+"px;top: "+(current_platform.y-25)+"px; width: 25px; height: 25px;'></div>"
			pf_t = "<div class='"+theme+"_platform_t allow_build' style='position:absolute;left: "+(current_platform.x)+"px;top: "+(current_platform.y-25)+"px; width: "+(current_platform.width)+"px; height: 25px;'></div>"
			pf_tr = "<div class='"+theme+"_platform_tr allow_build' style='position:absolute;left: "+(current_platform.x+current_platform.width)+"px;top: "+(current_platform.y-25)+"px; width: 25px; height: 25px;'></div>"
			pf_l = "<div class='"+theme+"_platform_l allow_build' style='position:absolute;left: "+(current_platform.x-25)+"px;top: "+(current_platform.y)+"px; width: 25px; height: "+(current_platform.height)+"px;'></div>"
			pf_r = "<div class='"+theme+"_platform_r allow_build' style='position:absolute;left: "+(current_platform.x+current_platform.width)+"px;top: "+(current_platform.y)+"px; width: 25px; height: "+(current_platform.height)+"px;'></div>"
			pf_bl = "<div class='"+theme+"_platform_bl allow_build' style='position:absolute;left: "+(current_platform.x-25)+"px;top: "+(current_platform.y+current_platform.height)+"px; width: 25px; height: 25px;'></div>"
			pf_b = "<div class='"+theme+"_platform_b allow_build' style='position:absolute;left: "+(current_platform.x)+"px;top: "+(current_platform.y+current_platform.height)+"px; width: "+(current_platform.width)+"px; height: 25px;'></div>"
			pf_br = "<div class='"+theme+"_platform_br allow_build' style='position:absolute;left: "+(current_platform.x+current_platform.width)+"px;top: "+(current_platform.y+current_platform.height)+"px; width: 25px; height: 25px;'></div>"
			
			var $div = pf_tl + pf_t+ pf_tr + pf_l + pf_r + pf_bl + pf_b + pf_br +"<div class='"+theme+"_platform allow_build' style='position:absolute;left: "+(current_platform.x)+"px;top: "+(current_platform.y)+"px; width: "+(current_platform.width)+"px; height: "+(current_platform.height)+"px;'>"+contents+"</div>"
			
			$(document.body).append($div)
		}
	
	reveal_path(unlimited_level)
	console.log("U complete.")
}

/*
	Loads next level data
	Sets level parameters for next level
*/	
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

/*
	Loads all non-GUI elements from the level data into the field for Mission game mode
	Sets level parameters
*/	
function load_battlefield(set_level = 0, set_lives = 25, set_cash = 1200){
	
	lives = (set_lives == null) ? 25 : set_lives;
	level = (set_level == null) ? 0 : set_level;
	Banked = (set_cash == null) ? levels[level].cash : (levels[level].cash + set_cash);
	update_gui()
	
	level_start_location = levels[level].start
	level_max_wave = levels[level].wave.length;
	
	theme = levels[level].theme;

	theme_body = theme+"_body"; 
	$('body').addClass(theme_body)
	
	path_length = levels[level].path.length;
	end_location = levels[level].path[path_length- 1]
	var $div = "<div class='enemy_goal' id='goal"+this.level+"' style='position:absolute;left: "+(end_location.x-100)+"px;top: "+(end_location.y-125)+"px; width: 200px; height: 200px; padding-bottom: 150px '><div class='blackhole'><img src='images/black_hole.png' height=200; width=200; /></div></div>"
	$(document.body).append($div)

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
			
			pf_tl = "<div class='"+theme+"_platform_tl allow_build' style='position:absolute;left: "+(current_platform.x-25)+"px;top: "+(current_platform.y-25)+"px; width: 25px; height: 25px;'></div>"
			pf_t = "<div class='"+theme+"_platform_t allow_build' style='position:absolute;left: "+(current_platform.x)+"px;top: "+(current_platform.y-25)+"px; width: "+(current_platform.width)+"px; height: 25px;'></div>"
			pf_tr = "<div class='"+theme+"_platform_tr allow_build' style='position:absolute;left: "+(current_platform.x+current_platform.width)+"px;top: "+(current_platform.y-25)+"px; width: 25px; height: 25px;'></div>"
			pf_l = "<div class='"+theme+"_platform_l allow_build' style='position:absolute;left: "+(current_platform.x-25)+"px;top: "+(current_platform.y)+"px; width: 25px; height: "+(current_platform.height)+"px;'></div>"
			pf_r = "<div class='"+theme+"_platform_r allow_build' style='position:absolute;left: "+(current_platform.x+current_platform.width)+"px;top: "+(current_platform.y)+"px; width: 25px; height: "+(current_platform.height)+"px;'></div>"
			pf_bl = "<div class='"+theme+"_platform_bl allow_build' style='position:absolute;left: "+(current_platform.x-25)+"px;top: "+(current_platform.y+current_platform.height)+"px; width: 25px; height: 25px;'></div>"
			pf_b = "<div class='"+theme+"_platform_b allow_build' style='position:absolute;left: "+(current_platform.x)+"px;top: "+(current_platform.y+current_platform.height)+"px; width: "+(current_platform.width)+"px; height: 25px;'></div>"
			pf_br = "<div class='"+theme+"_platform_br allow_build' style='position:absolute;left: "+(current_platform.x+current_platform.width)+"px;top: "+(current_platform.y+current_platform.height)+"px; width: 25px; height: 25px;'></div>"
			
			var $div = pf_tl + pf_t+ pf_tr + pf_l + pf_r + pf_bl + pf_b + pf_br +"<div class='"+theme+"_platform allow_build' style='position:absolute;left: "+(current_platform.x)+"px;top: "+(current_platform.y)+"px; width: "+(current_platform.width)+"px; height: "+(current_platform.height)+"px;'>"+contents+"</div>"
			
			$(document.body).append($div)
		}
	reveal_path(levels[level])
}


/*
	Process the current selected level.
	level (obj) current_level = level data
*/	
function run_level(current_level) {
	$("#pause").show();
	var max_waves = current_level.wave.length-1;
	var last_wave_time = (current_level.wave[max_waves].delay * 1000) + 120000; //+2 minutes 
	var current_wave = 0;
	let prev = performance.now();
	let timer = 0;
	var sub_timer = 0;
	
	var level_time = animate({
			duration: last_wave_time,
			timing: linear,
			draw: function(progress) {	
				timer =  Math.round(progress*last_wave_time) / 1000
				$("#wavetimer").text(timer +" ["+last_wave_time/ 1000+"]")

				if (current_wave <= max_waves) {
					if (Math.round(timer) == (current_level.wave[current_wave].delay)) {
							var wave = current_level.wave[current_wave];
						total_enemy_count += wave.group_size
						
						MessageOutput("Our radar has detected incoming  "+ wave.type)

						//run_wave(enemies.get(wave.type), wave.type, wave.group_size, current_level.start, current_level.path)
						try {
						run_wave(wave.type, wave.group_size, current_level.start, current_level.path, wave.spread)
						}
							catch (e) { console.log(e)}
						waves_process++;
						current_wave++;
					}
				}
				if ((timer*100) > sub_timer){
					sub_timer += 8;
					for (const unit in units) {
						units[unit].run();
					}
					
					for (const tower in towers) {
						if (towers[tower].mode == "idle") {
							towers[tower].idle();
						}

					}
				}
			},
			complete: function(progress) {
				console.log("Done..")
				update_gui();
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

/*
	Process the current selected level.
	wave data is generated
*/	
function run_unlimited() {
		$("#pause").show();
		var u_runtime = runtime *60 * 1000; //time in milliseconds (30 minutes)
		var interval = 5;
		var difficulty = 1;
		var group_size = 5; //change back to 5
		var min_difficulty = 1;
		var max_difficulty = 1.5;
		var difficulty_grade = 0.2; 
		var sub_timer = 0;
		valid_enemy_types = [{"enemy":"Azaries", "count" :1, "spread" : 12}, {"enemy":"Gurhabs", "count" :1, "spread" : 12}, {"enemy":"Valcheraks", "count" :3, "spread" : 12}, {"enemy":"Earanours", "count" :6, "spread" : 12}, {"enemy":"Neblins", "count" :3, "spread" : 12}, {"enemy":"Taxi", "count" :5, "spread" : 12}, {"enemy":"Rasmori", "count" :3, "spread" : 12}, {"enemy":"Rasmori", "count" :2, "spread" : 12}, {"enemy":"Vandante", "count" :6, "spread" : 12} , {"enemy":"Vandante", "count" :5, "spread" : 12},{"enemy":"Tharak", "count" :18, "spread" : 12}, {"enemy":"Taxi", "count" :5, "spread" : 12}, {"enemy":"Rasmori", "count" :2, "spread" : 12}, {"enemy":"Darloki", "count" :25, "spread" : 12}] //more difficult added last; count assumes cost of group size 

		
		var wave_counter = 0;
			animate({
			duration: u_runtime,
			timing: linear,
			unlimited: true,
			draw: function(progress) {
				
				
				timer =  Math.round(progress*u_runtime) / 1000
				max_time =   Math.round(u_runtime) / 1000
				
				$("#wavetimer").text(Math.round(timer) +" ("+max_time+")")
				
	
					
				
				if (timer > wave_counter && timer <= (max_time - 120)) { //dont spawn anymore enemies last 2 minutes to allow field to clear.
					wave_counter += time_between_waves;
					waves_process++;
					update_gui();
					
					var min = Math.floor(min_difficulty);
					var max = Math.floor(max_difficulty);
					
					
					min = min > (valid_enemy_types.length-1) ? valid_enemy_types.length-1 : min;
					max = max > (valid_enemy_types.length-1) ? valid_enemy_types.length-1 : max;
					
					var enemy_type =getRndInteger(min, max);
					var wave_size = (group_size * difficulty) / valid_enemy_types[enemy_type].count;
					total_enemy_count += wave_size
					
					var cur_enemy = valid_enemy_types[enemy_type].enemy
					var spread = valid_enemy_types[enemy_type].spread
					MessageOutput("Our radar has detected incoming  "+ cur_enemy)
					
					//run_wave(enemies.get(cur_enemy), cur_enemy, wave_size, unlimited_level.start, unlimited_level.path)
					run_wave(cur_enemy, wave_size, unlimited_level.start, unlimited_level.path, spread)
	
					min_difficulty = min_difficulty + difficulty_grade
					max_difficulty = max_difficulty + (difficulty_grade * 1.5)
					difficulty += 0.4;
				}

				

				if ((timer*100) > sub_timer){
				
					sub_timer += 8;
					for (const unit in units) {
						units[unit].run();
					}
					
					for (const tower in towers) {
						if (towers[tower].mode == "idle") {
							towers[tower].idle();
						}

					}
				}				
			},
			complete: function(progress) {
				
				update_gui(true)
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


/*
	Generates wave content.
	wave data is generated
*/	
function run_wave(enemy_type, size, start_location, path, spread) {
	console.log(spread);
	var spawnable_enemies = size;
	
	var total_duration = spread * size * 100;
	var wave_time =	animate({
			duration: total_duration,
			timing: linear,
			draw: function(progress) {	
				var timx = getRndInteger(1, spread);
		
				if (timx == (spread-1) && spawnable_enemies > 0) { 
					var x_adj = getRndInteger(-10, 10);
					var y_adj = getRndInteger(-10, 10);
					var tmp_start_locationx = start_location.x + x_adj
					var tmp_start_locationy = start_location.y + y_adj
					switch (enemy_type) {	
					case "Azaries":
						spawn_enemy = new Azaries();
						break;
					case "Darloki":
						spawn_enemy = new Darloki();
						break;
					case "Earanours":
						spawn_enemy = new Earanours();
						break;	
					case "Valcheraks":
						spawn_enemy = new Valcheraks();
						break;	
					case "Gurhabs":
						spawn_enemy = new Gurhabs();
						break;	
					case "Tharak":
						spawn_enemy = new Tharak();
						break;	
					case "Neblins":
						spawn_enemy = new Neblins();
						break;	
					case "Taxi":
						spawn_enemy = new Taxi();
						break;	
					case "Rasmori":
						spawn_enemy = new Rasmori();
						break;							
					case "Vandante":
						spawn_enemy = new Vandante();
						break;							
					default:
						console.log("Enemy ", enemy_type, " does not exist!")
						break;	
					}
			
					spawn_enemy.construct_unit(generate_unique_id("obj_"), tmp_start_locationx, tmp_start_locationy, x_adj, y_adj); 
					spawn_enemy.create();
					units[spawn_enemy.id] = spawn_enemy;
					spawn_enemy.set_path(path);
					//spawn_enemy.run(); 
					spawnable_enemies--;
				}

				if (spawnable_enemies <= 0) {
					let requestId = requestAnimationFrame(animate)
					cancelAnimationFrame(requestId);
				}
			},
			complete: function(progress) {
				console.log("Done..")
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
	
	level_wave++;
}

/*
	Timer function to control a Tower's action and effects
*/
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

/*
	Create a 'unique' identifier
	(string) prefix = prefix to be used in the identifier
	returns (string) unique identifier
*/
function generate_unique_id(prefix) {
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


/*
	Generates output data about enemies that can be expected in a level 
	(obj) waves = wave data for current level
	(obj) data = list of object of type enemy [Extended]
	returns (string) of html data
*/
function get_level_details(waves, data) {
	var output = [];
	var enemie_list = [];
	
	//when waves are predefined for missions mode:
	if (waves != null) {
		for (var w = 0; w < waves.length; w++){		
			if (!enemie_list.includes(waves[w].type)) {
				enemie_list.push(waves[w].type)	
				var unit_data = data[waves[w].type]
				output.push(unit_data.get_enemy_details_as_html());
				unit_data.remove();
			}
		}
	}
	
	//when waves are not predefined, all units will be listed:
	else {
		for (const [key, value] of Object.entries(data)) {
			console.log(`${key}: ${value}`);
			var unit_data = value;
			output.push(unit_data.get_enemy_details_as_html());
			unit_data.remove();
		}
		
	}

	return output.join(",");
	
}

function hide_path(){
	$(".path_flow").remove();
}

function reveal_path(selected_level){
	
	if (enable_travel_path) {
		var path_arrow = new Enemy();
		
		var path = selected_level.path;
			
		var start = selected_level.start;
		var paths = selected_level.path;
		var end = path[path.length-1];
		var section_start = start;
		var section_end = null;
		var direction = null;
		var path_section_counter = 0;
		
		
		
		for (const path in paths) {
			section_end = paths[path]
			
			x1 = section_start.x
			y1 = section_start.y
			x2 = section_end.x
			y2 = section_end.y
			
			node_size = 50;
			
			if (x2 > x1) {
				direction = "path_flow flow_left"
				s_width = Math.abs(x2 - x1) - node_size
				s_height = node_size
				s_left = x1 + node_size/2;
				s_top = y1 - node_size/2
				
				var $div = $("<div>", {"class": direction}).css({
					position: 'absolute',
					height: s_height+'px',
					width: s_width+'px',
					top: s_top + 'px',
					left: s_left + 'px',
				})
					
			}
			
			if (x2 < x1) {
				direction = "path_flow flow_right"
				s_width = Math.abs(x2 - x1) - node_size
				s_height = node_size
				s_left = x2 + node_size/2;
				s_top = y1 - node_size/2
				
							
				var $div = $("<div>", {"class": direction}).css({
					position: 'absolute',
					height: s_height+'px',
					width: s_width+'px',
					top: s_top + 'px',
					left: s_left + 'px',
				})
			}
			
			if (y2 > y1) {
				direction = "path_flow flow_down"
				s_height = Math.abs(y2 - y1) - node_size
				s_width = node_size
				s_left = x1 - node_size /2;
				s_top = y1 + node_size/2
				
							
				var $div = $("<div>", {"class": direction}).css({
					position: 'absolute',
					height: s_height+'px',
					width: s_width+'px',
					top: s_top + 'px',
					left: s_left + 'px',
				})
			}
			
			if (y2 < y1) {
				direction = "path_flow flow_up"
				
				s_height = Math.abs(y2 - y1) - node_size
				s_width = node_size
				s_left = x1 - node_size/2;
				s_top = y2 + node_size/2
				
							
				var $div = $("<div>", {"class": direction}).css({
					position: 'absolute',
					height: s_height+'px',
					width: s_width+'px',
					top: s_top + 'px',
					left: s_left + 'px',

				})
			}
			$(document.body).append($div)
			section_start = section_end
			path_section_counter++;
		}
	}
}


/*
	Generates output data about enemies that can be expected in a level 
	(array) map_array = list of level (obj)
	returns (array) of (obj) ddDataPoint containing data to propagate ddData in dropdown list.
*/
function get_available_maps(map_array) {
	var index = 0;
	var ddData = []
	for (const map in map_array) {
		
		var ddDataPoint = {
			text: map_array[map].name,
			value: index,
			selected: false,
			description: map_array[map].name,
			imageSrc: map_array[map].image
		};
		ddData.push(ddDataPoint);
		index++;
	}
	return ddData;
}


/*
	Extrapolate coordinates to find the edge location of the line
	(int) x1 = source x location
	(int) y1 = source y location
	(int) x2 = second x location
	(int) y2 = second y location
	returns (obj) {x, y}
*/
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


function update_research(branch, branch_level){
	
			switch(branch) {
				 case 1:
					enemies_increased_damage_recieved_percentage += 2;
/*
use individual branch_level to further define specialty upgrade
*/
					if (branch_level == 5) {
						enemies_increased_damage_recieved_percentage += 3;
					}
					break;
					
				 case 2:
					cash_bonus_percentage += 4;
					if (branch_level == 5) {
						cash_bonus_percentage += 5
					}
					break;
					
				case 3:
					enemies_increased_damage_recieved_percentage += 2;
					if (branch_level == 5) {
						enemies_increased_damage_recieved_percentage += 5;
					}
					break;
					
				case 4:
					cash_bonus_percentage += 4;
					if (branch_level == 5) {
						level_6_tower = true;
					}
					break;
				case 5:
					enemies_increased_damage_recieved_percentage += 3;
					if (branch_level == 5) {
						cannontower_bonus_damage += 50;
						cannontower_bonus_splash_damage += 35;
					}
					break;	
										
				default:
					console.log("Invalid branch:", branch)
					break;				

						
			}
//cannontower_bonus_damage
}