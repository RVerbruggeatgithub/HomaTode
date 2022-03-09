class ResearchFacility extends Tower {
	constructor(){
		super(); 
		this.price = [1000]
		this.value = [500]
		this.structuregraphic = "structure_research_facility"
		this.size = 75;
	}
	
	remove () {
		delete towers[this.id] 
		$("#"+this.id).remove();
	}
	
	create() {			
		var $div = "<div id='"+this.id+"' class='tower_base_2' style='position:absolute;left: "+this.x+";top: "+this.y+"; width: "+this.size+"px; height: "+this.size+"px'><div id='turret_"+this.id+"' class='"+this.structuregraphic+"_1' style='width: 100%; height: 100%; display: block'><div></div>"
		$(document.body).append($div)
		this.turret_id = "turret_"+this.id;
	}
	
	get_tower_details_as_html(){
	
		var empty_str = "";
		var header = "Research Facility"
		var level = ""

		var sell_price = 0;
		var upgrade_price = 0;
		var description = "This facility can be used perform research. Building multiple research facilities will have no effect."
		var special1 = "<button class='open_research'>RESEARCH</button>";
		upgrade_price = this.level < 5 ? "$"+this.price[this.level] : "N/A";
		var contents = empty_str.concat("<h3>", header, " ", "<br /> (Sell:", this.value[this.level - 1], " Upgrade cost: ","N/A" ,")</h3>", description, "<br />", special1);
		return contents;
	}
	
	upgrade() {	
		//this structure cannot be upgraded.
	}

	attack	() {
		//this structure cannot be attack.
	}		
	
	
	sleep() {	
		//this structure cannot be sleep.
	}	
}	