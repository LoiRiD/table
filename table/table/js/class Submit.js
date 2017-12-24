function Submit( time, teamId, problemCode, state, test ) {
	this.time = time;
	this.teamId = teamId;
	this.problemCode = problemCode;
	this.state = state;
	this.test = test;
	this.checked = false;
}

Submit.prototype.getTime = function() {
	return Math.floor( this.time / 60 ) + ( this.time % 60 >= 30 );
}