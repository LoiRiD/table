function updateTable() {
	updateTableProblem();
	updateTrSolvedAndTime();
	updateTrPlace();
	updateTableClass();
	updateTrStatistic();
	sortTable();
}

function sortTable() {
	for( var i = 0; i < teamPlace.length; i ++ ) {
		sortTr( teamPlace[i], i + 3 );
	}
}

function sortTrNextSubmit() {
	var team = teamId.get( submits[nextSubmit].teamId );
	var place = 0;
	for( var i = 0; i < teamPlace.length; i ++ ) {
		if( teamPlace[i] == team ) {
			place = i + 3;
		}
	}
	return sortTrSubmit( team, place );
}

function sortTrNextTeamSubmit() {
	var place = 0;
	for( var i = 0; i < teamPlace.length; i ++ ) {
		if( teamPlace[i] == prevTeam ) {
			place = i + 3;
		}
	}
	return sortTrSubmit( prevTeam, place );
}

function sortTrSubmit( team, place ) {
	var tr = document.getElementById( teams[team].id );
	var n = tr.rowIndex - place;
	var speedd = speed / 5;
	for( var i = tr.rowIndex - 1, j = 1; i >= place; i --, j ++ ) {
		setTimeout( sortTr, j * speedd, team, i );
		//sortTr( team, i );
	}
	return speed + n * speedd;
}

function sortTr( team, place ) {
	var table = document.getElementById( "table" );
	var tr = document.getElementById( teams[team].id );
	for( var i = tr.rowIndex - 1; i >= place; i -- ) {
		table.rows[i].parentNode.insertBefore( tr, table.rows[i] );
	}
}

function updateTableClass() {
	var color = true;
	var name = "tdBody"
	for( var i = 0; i < teamPlace.length; i ++ ) {
		if( i == 0 || teams[teamPlace[i]].solved != teams[teamPlace[i - 1]].solved )
			color = !color;
		updateTrClass( teamPlace[i], name + ( 1 + color ) );
	}
}

function updateTrClass( team, className ) {
	updateTdPlaceClass( team, className );
	updateTdNameClass( team, className );
	updateTdSolvedClass( team, className );
	updateTdTimeClass( team, className );
}

function updateTdPlaceClass( team, className ) {
	var id = teams[team].getIdPlace();
	var td = document.getElementById( id );
	td.className = className;
}

function updateTdNameClass( team, className ) {
	if( modeOrder && team == showNextTeam ) {
		prevTeamClass = className;
		return;
	}
	var id = teams[team].getIdName();
	var td = document.getElementById( id );
	td.className = className;
}

function updateTdSolvedClass( team, className ) {
	var id = teams[team].getIdSolved();
	var td = document.getElementById( id );
	td.className = className;
}

function updateTdTimeClass( team, className ) {
	var id = teams[team].getIdTime();
	var td = document.getElementById( id );
	td.className = className;
}

function updateTrPlace() {
	sortTeamPlace();
	var place = 1;
	for( var i = 0; i < teamPlace.length; i ++ ) {
		if( i == 0 || compareSortTeamPlace( teamPlace[i], teamPlace[i - 1] ) )
			place = i + 1;
		updateTdPlace( teamPlace[i], place );
	}
}

function updateTdPlace( team, place ) {
	var id = teams[team].getIdPlace();
	var td = document.getElementById( id );
	td.innerHTML = place;
}

function updateTrSolvedAndTime() {
	for( var i = 0; i < teams.length; i ++ ) {
		updateTdSolved( i );
		updateTdTime( i );
	}
}

function onTdNextSubmit() {
	var team = teamId.get( submits[nextSubmit].teamId );
	var problem = problemId.get( submits[nextSubmit].problemCode );
	onTdSubmit( team, problem );
}

function onTdNextTeamSubmit() {
	var team = teamPlace[nextTeam];
	var submit = teams[team].getIdSubmit();
	var problem = problemId.get( submits[submit].problemCode );
	onTdSubmit( team, problem );
}

function onTdSubmit( team, problem ) {
	var id = teams[team].getIdProblem( problem );
	var td = document.getElementById( id );
	td.className = "tdNewSubmit";
}

function offTdNextSubmit() {
	var team = teamId.get( submits[nextSubmit].teamId );
	var problem = problemId.get( submits[nextSubmit].problemCode );
	offTdSubmit( team, problem );
}

function offTdNextTeamSubmit() {
	var team = teamPlace[nextTeam];
	var submit = teams[team].getIdSubmit();
	var problem = problemId.get( submits[submit].problemCode );
	offTdSubmit( team, problem );
}

function offTdSubmit( team, problem ) {
	updateTdProblem( team, problem );
	updateTdSolvedAndTime( team );
}

function onTdTeam() {
	var team = teamPlace[nextTeam];
	var td = document.getElementById( teams[team].getIdName() );
	prevTeamClass = td.className;
	td.className = "tdTeamSubmit";
	showNextTeam = team;
}

function offTdTeam() {
	if( showNextTeam == -1 )
		return;
	var td = document.getElementById( teams[showNextTeam].getIdName() );
	td.className = prevTeamClass;
	showNextTeam = -1;
}

function updateTdSolvedAndTime( team ) {
	updateTdSolved( team );
	updateTdTime( team );
}

function updateTdSolved( team ) {
	var id = teams[team].getIdSolved();
	var td = document.getElementById( id );
	td.innerHTML = teams[team].getSolved();
}

function updateTdTime( team ) {
	var id = teams[team].getIdTime();
	var td = document.getElementById( id );
	td.innerHTML = teams[team].getTime();
}

function updateTableProblem() {
	for( var i = 0; i < teams.length; i ++ ) {
		for( var j = 0; j < problems.length; j ++ ) {
			updateTdProblem( i, j );
		}
	}
}

function updateTdProblem( team, problem ) {
	var id = teams[team].getIdProblem( problem );
	var td = document.getElementById( id );
	td.innerHTML = teams[team].getVerdict( problem );
	td.className = teams[team].getClassVerdict( problem );
}

function updateTrStatistic() {
	for( var i = 0; i < problems.length; i ++ ) {
		updateTdStatisticProblem( i );
	}
	updateTdTotal();
}

function updateTdStatisticProblem( problem ) {
	var id = problems[problem].getIdStatistic();
	var td = document.getElementById( id );
	td.innerHTML = problems[problem].getSolved();
	td.className = problems[problem].getClassSolved();
}

function updateTdTotal() {
	var td = document.getElementById( "Total" );
	td.innerHTML = getTotal();
}

function getTotal() {
	var solved = 0;
	var submit = 0;
	for( var i = 0; i < problems.length; i ++ ) {
		solved += problems[i].solved;
		submit += problems[i].submit;
	}
	var str = "";
	str += solved;
	str += "<br>";
	str += submit;
	return str;
}