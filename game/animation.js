function animate({timing, draw, duration, complete, pause}) {

	let start = performance.now();
	let pause_duration = 0;
	let pause_start = null;
	let pause_end = false;
	let p_dif = 0;

	requestAnimationFrame(function animate(time) {
			
		try {
	// timeFraction goes from 0 to 1
		paused = pause();
		
		let timeFraction = (time - start) / duration;
		
		if (terminate()) {
			timeFraction = 1;
		}
		
		if (!paused) {	
			
				
			if (pause_end) {
				
				
				p_dif = performance.now()-pause_start;
				start += p_dif
				pauseFraction = p_dif / duration
				
				timeFraction -= pauseFraction;
				time = time - p_dif
				pause_end = false;
			}
				
				if (timeFraction > 1) timeFraction = 1;

				// calculate the current animation state
				let progress = timing(timeFraction);

			
				draw(progress); // draw it

				if (timeFraction < 1) {
				  requestAnimationFrame(animate);
				}
				
				if (timeFraction == 1) {
					complete(progress)
				}
		}
		else {
			if (!pause_end) {
					pause_start = performance.now()				
					pause_end = true;
				}
				requestAnimationFrame(animate);
			}
		}
		catch (error) {
			if (debug) {
				console.log(error)
			}
		}
	});

}
	

function makeEaseInOut(timing) {
  return function(timeFraction) {
	if (timeFraction < .5)
	  return timing(2 * timeFraction) / 2;
	else
	  return (2 - timing(2 * (1 - timeFraction))) / 2;
  }
}

function linear(timeFraction) {
	return timeFraction;
}

function unlimited(timeFraction) {
	return 0;
}

function terminate() {
	
	if (rungame) {
		return false;
	}
	else {
		return true;
	}
}

