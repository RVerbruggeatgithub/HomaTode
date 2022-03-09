class Timer {

	constructor(callback, delay){
		var timerId, start, remaining = delay;
	}
	
	pause() {
		window.clearTimeout(this.timerId);
		//remaining -= Date.now() - start;
	};

	resume() {
		this.start = Date.now();
		window.clearTimeout(timerId);
		this.timerId = window.setTimeout(callback, remaining);
	};
	
	stop() {
		window.clearTimeout(timerId);
	}

	this.resume();
}