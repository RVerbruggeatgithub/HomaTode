function get_victory_conditions(return_conditions = true) {
	var units_onscreen = Object.keys(units).length;
	condition1 = rungame ? true : false;
	condition2 = units_onscreen == 0 ? true : false;
	condition3 = waves_process == level_max_wave ? true : false;
	condition4 = lives > 0 ? true : false;
	condition5 = enemies_removed >= total_enemy_count ? true : false;
	if (return_conditions) {
		return (condition1 && condition2 && condition3 && condition4 && condition5);
		
	}
	else {
		console.log({"rungame" : [rungame, condition1], "units_onscreen == 0" : [units_onscreen, condition2], "waves_process == level_max_wave" : [waves_process, level_max_wave, condition3], "lives > 0" : [lives, condition4], "enemies_removed >= total_enemy_count" : [enemies_removed, total_enemy_count, condition5]});

	}
	
}



function update_gui(terminate = false) {
	$("#cash").text(Banked)
	$("#lives").text(lives)
	$("#kills").text(enemies_killed)
	$("#waves").text(waves_process)

	if (terminate) {
		rungame = false;
		
		big_message('MISSION COMPLETE!', null, 8000, false)
		$("#pause").hide();

		new Timer(() => {	
				total_enemy_count = Math.round(total_enemy_count)
				$("#stats").html("<table><tr><td>Waves completed:</td><td>"+waves_process+"</td></tr><tr><td>Total Enemies:</td><td>"+total_enemy_count+"</td></tr><tr><td>Enemies killed:</td><td>"+(total_enemy_count-enemies_passed)+"</td></tr><tr><td>Enemies escaped:</td><td>"+enemies_passed+"</td></tr><tr><td>Cash left:</td><td>"+Banked+"</td></tr><tr><td>Lives left:</td><td>"+lives+"</td></tr></table>")
				$("#continue").hide();
				openNav('mStats')
				showNav();
				unload_battlefield();
		}, 1500);
	}
	
	
	if (!terminate && lives <= 0 || isNaN(lives) && rungame) {
		
		rungame = false;
		
		big_message('GAME OVER', null, 8000, false)

		$("#pause").hide();
		new Timer(() => {	
				$("#stats").html("<table><tr><td>Waves completed:</td><td>"+waves_process+"</td></tr><tr><td>Total Enemies:</td><td>"+total_enemy_count+"</td></tr><tr><td>Enemies killed:</td><td>"+(total_enemy_count-enemies_passed)+"</td></tr><tr><td>Enemies escaped:</td><td>"+enemies_passed+"</td></tr><tr><td>Cash left:</td><td>"+Banked+"</td></tr><tr><td>Lives left:</td><td>"+lives+"</td></tr></table>")
				$("#continue").show();
				openNav('mStats')
				showNav();
				unload_battlefield();
		}, 1500);
	}
	
	//level_wave
	//get max wave first
	
	if (mode == "regular") {
		

		if (get_victory_conditions() && rungame) {
			rungame = false;
			big_message('VICTORY!', null, 8000, false)
			$("#pause").hide();
			new Timer(() => {	
				$("#stats").html("<table><tr><td>Waves completed:</td><td>"+waves_process+"</td></tr><tr><td>Total Enemies:</td><td>"+total_enemy_count+"</td></tr><tr><td>Enemies killed:</td><td>"+(total_enemy_count-enemies_passed)+"</td></tr><tr><td>Enemies escaped:</td><td>"+enemies_passed+"</td></tr><tr><td>Cash left:</td><td>"+Banked+"</td></tr><tr><td>Lives left:</td><td>"+lives+"</td></tr></table>")
			
				openNav('mStats')
				showNav();
				unload_battlefield();
			}, 1500);
		}
	}
}


function big_message(content = null, size = null, duration = null, closeable = false) {

	duration = (duration == null) ? 2500 : duration;

	if (size == null) {
		size = 10;
	}
	
	closeable = closeable ? "onclick='$(this).remove()'" : "";
	
	$("<div "+closeable+" class='Main_notification' style='font-size: "+size+"px;'><hr style='top: -42px'><div>"+content+"</div><hr style='top: -34px' class='img-vert'></div>").appendTo('body').animate({
		opacity: 0.10
	  }, duration, function() {
		$(this).remove();
	 });
}

function MessageOutput(message) {

	var $div = $("<div>"+message+"</div>").css({"display": "block", "width" : "250px", "height": "12px" , "position" : "relative"}).fadeOut(7500, function() {
		$(this).remove(); 
	})
	$("#output").append($div)
}

 $( function() {
    $( "#dialog-message" ).dialog({
      modal: true,
      buttons: {
        Ok: function() {
          $( this ).dialog( "close" );
        }
      }
    });
	$( "#dialog-message" ).dialog( "close" );
  } );
  

function loadLogs(into) {
	
	$.ajax({
		url : "change_logs.txt",
		dataType: "text",
		success : function (data) {
			$("#"+into).html(data);
		},
		error: function () {
			$("#"+into).html("Unable to open logs file, blocked by CORS policy.");
		}
	});
	
}

	
function get_help(lvl) {
	if (mode == "regular") {
		var html_text = get_level_details(levels[lvl].wave, enemytypes)
	}
	
	if (mode =="unlimited") {
		var html_text = get_level_details(null, enemytypes)
	}
	
	return html_text;
}	



function showNav() {
  document.getElementById("myNav").style.width = "100%";
  $(".menu_bar").hide()
}

function hideNav() {
  document.getElementById("myNav").style.width = "0%";
  $(".menu_bar").show()
}

function openNav(selected_nav) {
  var i;
  var x = document.getElementsByClassName("nav_option");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  if (selected_nav == "m3"){
	try {
		help_text = get_help(level) //change level to wave_data!
		$("#help_details").html(help_text);
	}
	catch (e) {
		$("#help_details").html("Unable to load wave data, please start a new game first.")
	}
  }
  
  document.getElementById(selected_nav).style.display = "block";
}