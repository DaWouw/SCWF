
var Timer = {
	
	overview : [],
	current : 0,
	iteration : 0,
	
	start : function() {
		if(this.current != 0) console.warn("! Timer.start var current != 0");
		this.current = new Date().getTime();
	},
	stop : function(log) {
		var elapsed = new Date().getTime() - this.current;
		if(log) console.info("Step "+this.iteration+" - "+elapsed+"ms - "+log);
		this.current = 0;
		return elapsed;
	},
	startN : function(name) {
		var start = new Date().getTime();
		this.overview[name] = [start, 0];
	},
	stopN : function(name, log) {
		this.overview[name][1] = new Date().getTime() - this.overview[name][0];
		if(log) console.info("Step "+this.iteration+" - "+this.overview[name][1]+"ms - "+log);
		return this.overview[name][1];
	},
	
	getIteration : function() {
		return this.iteration;
	},

	incIteration : function() {
		this.iteration++;
	},
	
	time_left : [],
	cinterval : [],
	countdown_timer_init : function(timeSec, elemID) {
		//The setInterval() method calls a function or evaluates an expression at specified intervals (in milliseconds).
		//The setInterval() method will continue calling the function until clearInterval() is called, or the window is closed.
		this.cinterval[elemID] = setInterval("Timer.countdown_timer("+timeSec+",'"+elemID+"');", 1000);
	},
	countdown_timer : function(timeSec, elemID) {	//TODO: make this millisecond compatible for a cooler timer
		if(document.getElementById(elemID))
		{
			if(timeSec && (typeof this.time_left[elemID] == 'undefined' || this.time_left[elemID] == 0)) {	//Only to init timeSec once
				this.time_left[elemID] = timeSec;
			}
			
			// decrease timer
			this.time_left[elemID]--;
			document.getElementById(elemID).innerHTML = this.time_left[elemID];
			if(this.time_left[elemID] == 0){
				this.time_left[elemID] = 0;
				clearInterval(this.cinterval[elemID]);
			}
		}
		else
		{
			this.time_left[elemID] = 0;
			clearInterval(this.cinterval[elemID]);
		}
	},
	countdown_timer_get : function(elemID) {
		return this.time_left[elemID];
	},
	countdown_timer_stop : function(elemID) {
		this.time_left[elemID] = 0;
		clearInterval(this.cinterval[elemID]);
	},
	
};

