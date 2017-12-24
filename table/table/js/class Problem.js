function Problem( code ) {
	this.code = code;
	this.solved = 0;
	this.submit = 0;
}

Problem.prototype.getIdStatistic = function() {
	return this.code + ".statistic";
}

Problem.prototype.getSolved = function() {
	var str = "";
	str += this.solved;
	str += "<br>";
	str += this.submit;
	return str;
}

Problem.prototype.getClassSolved = function() {
	if( this.solved == 0 && this.submit == 0 )
		return "tdStatistic";
	if( this.solved )
		return "tdAccepted";
	if( this.submit )
		return "tdReject";
}

Problem.prototype.addSubmit = function( submit ) {
	if( submits[submit].state == "accepted" )
		this.solved ++;
	this.submit ++;
}