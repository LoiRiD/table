/*var fixHelper = function(e, ui) {
	ui.children().each(function() {
		$(this).width($(this).width());
		$(this).height($(this).height());
	});
	return ui;
};*/

function createTable() {
	var table = document.createElement( "table" );
	table.appendChild( createThead() );
	table.appendChild( createTbody() );
	table.className = "table";
	table.id = "table";
	var div = document.getElementById( "printTable" );
	var oldTable = document.getElementById( "table" );
	var newTable = div.appendChild( table );
	if( oldTable != null ) {
		div.replaceChild( newTable, oldTable );
	}
	//$("#table tbody").sortable({
	//	helper: fixHelper
	//}).disableSelection();
}

function createThead() {
	var thead = document.createElement( "thead" );
	thead.appendChild( createTrHead() );
	thead.appendChild( createTrStatistic() );
	
	var tr = document.createElement( "tr" );
	var td = document.createElement( "td" );
	td.className = "tdSeparator";
	td.setAttribute( "colspan", 4 + problems.length );
	tr.appendChild( td );
	thead.appendChild( tr );
	
	return thead;
}

function createTrHead() {
	var tr = document.createElement( "tr" );
	tr.appendChild( createTd( "Place", "", "tdHeadSqr" ) );
	tr.appendChild( createTd( "Team name", "", "tdHead" ) );
	for( var i = 0; i < problems.length; i ++ ) {
		tr.appendChild( createTd( problems[i].code, "", "tdHeadSqr" ) );
	}
	tr.appendChild( createTd( "=", "", "tdHeadSqr" ) );
	tr.appendChild( createTd( "Time", "", "tdHeadSqr" ) );
	return tr;
}

function createTrStatistic() {
	var tr = document.createElement( "tr" );
	tr.appendChild( createTd( "", "", "tdStatistic" ) );
	tr.appendChild( createTd( "Accepted<br>Submits", "", "tdStatistic" ) );
	for( var i = 0; i < problems.length; i ++ ) {
		tr.appendChild( createTd( "", problems[i].getIdStatistic(), "tdStatistic" ) );
	}
	tr.appendChild( createTd( "", "Total", "tdStatistic" ) );
	tr.appendChild( createTd( "", "", "tdStatistic" ) );
	return tr;
}

function createTh( text, id, className ) {
	var th = document.createElement( "th" );
	th.innerHTML = text;
	//td.appendChild( document.createTextNode( text ) );
	th.id = id;
	th.className = className;
	return th;
}

function createTbody() {
	var tbody = document.createElement( "tbody" );
	for( var i = 0; i < teams.length; i ++ ) {
		var tr1 = document.createElement( "tr" );
		var tr2 = document.createElement( "tr" );
		tr1.appendChild( createTd( "1", teams[i].getIdPlace(), "tdBody1", 2, 2 ) );
		tr1.appendChild( createTd( teams[i].name, teams[i].getIdName(), "tdBody1", 1, 12 ) );
		for( var j = 0; j < problems.length; j ++ ) {
			tr2.appendChild( createTd( "", teams[i].getIdProblem( j ), "tdNull" ) );
		}
		tr1.appendChild( createTd( "0", teams[i].getIdSolved(), "tdBody1", 2 ) );
		tr1.appendChild( createTd( "0", teams[i].getIdTime(), "tdBody1", 2 ) );
		tr1.id = teams[i].id;
		tr2.id = -teams[i].id;
		tbody.appendChild( tr1 );
		tbody.appendChild( tr2 );
	}
	return tbody;
}

function createTd( text, id, className, rowSpan = 1, colSpan = 1 ) {
	var td = document.createElement( "td" );
	td.innerHTML = text;
	//td.appendChild( document.createTextNode( text ) );
	td.id = id;
	td.className = className;
	td.rowSpan = rowSpan;
	td.colSpan = colSpan;
	return td;
}

function createTeams() {
	for( var i = 0; i < teams.length; i ++ ) {
		teams[i].createProblems( problems.length );
		teams[i].submit = [];
		teams[i].nextSubmit = 0;
	}
	for( var i = 0; i < submits.length; i ++ ) {
		var team = teamId.get( submits[i].teamId );
		var problem = problemId.get( submits[i].problemCode );
		if( team == null || problem == null )
			continue;
		teams[team].submit.push( i );
		if( submits[i].state == "accepted" && problemFirstSolved[problem] == -1 ) { 
			problemFirstSolved[problem] = teams[team].id;
		}
	}
}

function createTeamsAllSubmit() {
	for( var team = 0; team < teams.length; team ++ ) {
		for( var problem = 0; problem < problems.length; problem ++ ) {
			teams[team].problemAllSubmit[problem] = 0;
		}
	}
	for( var i = 0; i < submits.length; i ++ ) {
		var team = teamId.get( submits[i].teamId );
		var problem = problemId.get( submits[i].problemCode );
		if( team == null || problem == null )
			continue;
		if( !submits[i].checked && submits[i].time <= freezeTime )
			teams[team].problemAllSubmit[problem] ++;
	}
}

function createMaps() {
	teamId = new Map();
	teamPlace = [];
	problemId = new Map();
	problemFirstSolved = [];
	for( var i = 0; i < teams.length; i ++ ) {
		teamId.set( teams[i].id, i );
		teamPlace[i] = i;
	}
	for( var i = 0; i < problems.length; i ++ ) {
		problemId.set( problems[i].code, i );
		problemFirstSolved.push( -1 );
	}
}

function compareSortSubmit( i, j ) {
	if( i.time < j.time )
		return -1;
	if( i.time > j.time )
		return 1;
	return 0;
}

function createSubmits() {
	submits.sort( compareSortSubmit );
	for( var i = 0; i < submits.length; i ++ ) {
		submits[i].checked = false;
	} 
}

function createProblems() {
	for( var i = 0; i < problems.length; i ++ ) {
		problems[i].solved = 0;
		problems[i].submit = 0;
	}
}