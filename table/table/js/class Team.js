function Team( id, name ) {
	this.id = id;
	this.name = name;
	this.problemAllSubmit = [];
	this.problemSubmit = [];
	this.problemSolved = [];
	this.problemTime = [];
	this.problemSubmits = [];
	this.solved = 0;
	this.time = 0;
	this.submit = [];
	this.nextSubmit = 0;
}

Team.prototype.azaza = function() { 
	alert( "azaza" );
}

Team.prototype.getSolved = function() { 
	var str = "";
	str += this.solved;
	return str;
}

Team.prototype.getTime = function() { 
	var str = "";
	str += this.time;
	return str;
}

Team.prototype.getVerdict = function( problem ) {
	var str = "";
	if( this.problemSolved[problem] )
		str += "+";
	else if( this.problemSubmit[problem] )
		str += "-";
	else 
		str += "";
	if( this.problemSubmit[problem] )
		str += this.problemSubmit[problem];
	if( ( this.problemSubmit[problem] || this.problemSolved[problem] ) && showTime ) {
		str += "<br>";
		str += this.getTimeProblem( problem );
	}
	return str;
}

Team.prototype.getClassVerdict = function( problem ) {
	if( this.id == problemFirstSolved[problem] && this.problemSolved[problem] )
		return "tdFirstAccepted";
	if( this.problemSolved[problem] )
		return "tdAccepted";
	if( this.problemAllSubmit[problem] && showSubmit )
		return "tdSubmit";
	if( this.problemSubmit[problem] )
		return "tdReject";
	return "tdNull";
}

Team.prototype.getTimeProblem = function( problem ) {
	var str = "";
	var hour = Math.floor( this.problemTime[problem] / 60 );
	var minute = this.problemTime[problem] % 60;
	str += hour;
	str += ":";
	if( minute < 10 )
		str += "0";
	str += minute;
	return str;
}

Team.prototype.addSubmit = function( submit ) {
	var problem = problemId.get( submits[submit].problemCode );
	if( this.problemSolved[problem] )
		return;
	if( this.problemSubmits[problem].length ) {
		return this.addAllSubmit( problem );
	} else {
		return this.addOneSubmit( submit );
	}
}

Team.prototype.addOneSubmit = function( submit ) {
	var problem = problemId.get( submits[submit].problemCode );
	this.problemTime[problem] = submits[submit].getTime();
	this.problemAllSubmit[problem] --;
	problems[problem].addSubmit( submit );
	if( submits[submit].state == "accepted" ) {
		this.solvedProblem( problem );
		return true;
	} else {
		this.problemSubmit[problem] ++;
		return false;
	}
}

Team.prototype.addAllSubmit = function( problem ) {
	var res = false;
	for( var i = 0; i < this.problemSubmits[problem].length; i ++ ) {
		if( this.addOneSubmit( this.problemSubmits[problem][i] ) )
			res = true;
	}
	this.problemSubmits[problem] = [];
	return res;
}

Team.prototype.addProblemSubmit = function( submit ) {
	var problem = problemId.get( submits[submit].problemCode );
	if( this.problemSolved[problem] )
		return;
	this.problemSubmits[problem].push( submit );
	return ( submits[submit].state == "accepted" || this.problemSubmits[problem].length == this.problemAllSubmit[problem] );
} 

Team.prototype.solvedProblem = function( problem ) {
	this.problemSolved[problem] = true;
	this.solved ++;
	this.time += this.problemTime[problem];
	this.time += 20 * this.problemSubmit[problem];
}

Team.prototype.clearProblemSubmits = function() {
	for( var i = 0; i < this.problemSubmits.length; i ++ ) {
		for( var j = 0; j < this.problemSubmits[i].length; j ++ ) {
			var submit = this.problemSubmits[i][j];
			submits[submit].checked = false;
		}
		this.problemSubmits[i] = [];
	}
}

Team.prototype.createProblems = function( problems ) {
	this.problemAllSubmit = [];
	this.problemSubmit = [];
	this.problemSolved = [];
	this.problemTime = [];
	for( var i = 0; i < problems; i ++ ) {
		this.problemAllSubmit.push( 0 );
		this.problemSubmit.push( 0 );
		this.problemSolved.push( false );
		this.problemTime.push( 0 );
		this.problemSubmits.push( [] );
	}
	this.solved = 0;
	this.time = 0;
}

Team.prototype.getIdPlace = function() {
	return this.id + '.' + 'Place';
}

Team.prototype.getIdName = function() {
	return this.id + '.' + 'Name';
}

Team.prototype.getIdSolved = function() {
	return this.id + '.' + 'Solved';
}

Team.prototype.getIdTime = function() {
	return this.id + '.' + 'Time';
}

Team.prototype.getIdProblem = function( problem ) {
	return this.id + '.' + problems[problem].code;
}

Team.prototype.getIdSubmit = function() {
	return this.submit[this.nextSubmit];
}