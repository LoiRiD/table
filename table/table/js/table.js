var isLoadLog = false;

var teams = [];
var problems = [];
var submits = [];

var teamId = new Map();
var problemId = new Map();

var teamPlace = [];
var problemFirstSolved = [];

var prevFunction;

var nextSubmit;
var nextTeam;
var prevTeam;
var prevTeamClass;
var showNextTeam;

var freezeTime = 240 * 60;
var speed = 500;
var showSimulate = true;
var showTime = true;
var showSubmit = false;
var showAllSubmit = false;
var modeOrder = true;
var modeStep = true;
var step = false;
var nextFunction = false;
var isFreezeTime = false;

var timerNextFunction;

var KEY_CODE = {
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
	SPACE: 187
};

window.unload = function() {
	document.getElementById( "newTable" ).onclick = newTable;
	document.getElementById( "modeStepOn" ).onclick = setModeStep;
	document.getElementById( "modeStepOff" ).onclick = setModeStep;
	document.getElementById( "showTime" ).onclick = setShowTime;
	document.getElementById( "showSubmit" ).onclick = setShowSubmit;
}

window.addEventListener( "keyup", handler, false );

function loadLog( onSuccess ) {
	var files = document.getElementById( "fileLog" ).files;
	if( !files.length ) {
		return false;
	}
	var reader = new FileReader();
	
	reader.onloadend = function( event ) {
		onSuccess( event.target.result );
	};
	
	reader.onerror = function( event ) {
		alert( "Файл не может быть прочитан! Код ошибки: " + event.target.error.code );
	};
	
	isLoadLog = true;
	//reader.readAsText( files[0] );
	reader.readAsText( files[0], "CP1251" );
	return true;
}
	
function loadLogFromUser() {
	if( loadLog( function( log ) {
		isLoadLog = false;
		loadLogFromFile( log, teams, problems, submits );
		createTable();
		goStart();
	} ) ) {
		deleteTable();
	}
}

function loadLogFromServer() {
	deleteTable();
	isLoadLog = true;
	var file = document.getElementById( "fileLogFromServer" ).value;
	$.get( "php/loadLog.php", { "file": file }, function( data ) {
		isLoadLog = false;
		loadLogFromFile( data, teams, problems, submits );
		createTable();
		goStart();
	} );
}

function newTable() {
	if( isLoadLog ) {
		alert( "Дождитесь загрузки лога." );
		return;
	}
	clearTimeout( timerNextFunction );
	setFreezeTime();
	getModeOrder();
	createMaps();
	createSubmits();
	createTeams();
	createTeamsAllSubmit();
	createProblems();
	createTable();
	updateTable();
	nextSubmit = 0;
	nextTeam = teamPlace.length - 1;
	showNextTeam = -1;
	prevFunction = newTable;
	nextFunction = false;
	if( !showSimulate )
		step = true;
	else
		step = false;
	getNextFunction();
}

function deleteTable() {
	clearTimeout( timerNextFunction );
	teams = [];
	problems = [];
	submits = [];
}

function goFreezeTime() {
	showSimulate = false;
	newTable();
}

function goStart() {
	showSimulate = true;
	newTable();
}

function handler( event ) {
	if( event.keyCode == KEY_CODE.RIGHT || event.keyCode == KEY_CODE.LEFT ) {
		doStep();
	}
}

function doStep() {
	if( !showSimulate )
		return;
	if( modeStep ) {
		step = true;
	} else {
		step = !step;
	}
	if( !nextFunction ) {
		getNextFunction();
	}
}

function getNextFunction() {
	if( !step ) {
		nextFunction = false;
		return;
	}
	nextFunction = true;
	if( prevFunction == newTable ) {
		if( modeOrder ) {
			prevFunction = findNextTeam;
		} else {
			prevFunction = findNextSubmit;
			findNextSubmit();
		}
		return getNextFunction();
	}
	if( prevFunction == findNextTeam ) {
		if( nextTeam == -1 ) {
			onFreezeTime();
			return;
		}
		getModeOrder();
		if( !modeOrder ) {
			offTdTeam();
			prevFunction = findNextSubmit;
			findNextSubmit();
			return getNextFunction();
		}
		prevFunction = findNextTeamSubmit;
		findNextTeamSubmit();
		if( showSimulate && showNextTeam == -1 ) {
			onTdTeam();
			return addTimerNextFunction( speed );
		}
		return getNextFunction();
	}
	if( prevFunction == findNextTeamSubmit ) {
		if( checkNextTeamSubmit() ) {
			if( getShowAllSubmit() ) {
				findNextTeamSubmit();
				return getNextFunction();
			}
			if( showAllSubmit ) {
				if( !addNextTeamSubmitInTeam() ){
					findNextTeamSubmit();
					return getNextFunction();
				}				
			}
			if( showSimulate ) {
				onTdNextTeamSubmit();
				prevFunction = onTdNextTeamSubmit;
				return addTimerNextFunction( speed );
			} else {
				addNextTeamSubmit();
				findNextTeamSubmit();
				return getNextFunction();
			}
		} else {
			if( showSimulate ) {
				offTdTeam();
			}
			prevFunction = findNextTeam;
			findNextTeam();
			return getNextFunction();
		}
	}
	if( prevFunction == findNextSubmit ) {
		if( nextSubmit == submits.length ) {
			onFreezeTime();
			return;
		}
		if( freezeTime < submits[nextSubmit].time ) {
			nextSubmit --;
			onFreezeTime();
			return;
		}
		if( getShowAllSubmit() ) {
			findNextSubmit();
			return getNextFunction();
		}
		if( showAllSubmit ) {
			if( !addNextSubmitInTeam() ) {
				findNextSubmit();
				return getNextFunction();
			}			
		}
		if( showSimulate ) {
			onTdNextSubmit();
			prevFunction = onTdNextSubmit;
			return addTimerNextFunction( speed );
		} else {
			addNextSubmit();
			findNextSubmit();
			return getNextFunction();
		}
	}
	if( prevFunction == onTdNextTeamSubmit ) {
		if( addNextTeamSubmit() ) {
			prevFunction = updateTrPlace;
		} else {
			prevFunction = findNextTeam;
		}
		updateTrStatistic();
		offTdNextTeamSubmit();
		prevTeam = teamPlace[nextTeam];
		return addTimerNextFunction( speed );
	}
	if( prevFunction == onTdNextSubmit ) {
		if( addNextSubmit() ) {
			prevFunction = updateTrPlace;
		} else {
			prevFunction = sortTrNextSubmit;
		}
		updateTrStatistic();
		offTdNextSubmit();
		return addTimerNextFunction( speed ); 
	}
	if( prevFunction == updateTrPlace ) {
		updateTrPlace();
		updateTableClass();
		if( modeOrder ) {
			prevFunction = sortTrNextTeamSubmit;
		} else {
			prevFunction = sortTrNextSubmit;
		}
		var timePause = prevFunction();
		return addTimerNextFunction( timePause );
	}
	if( prevFunction == sortTrNextTeamSubmit ) {
		offTdTeam();
		getModeOrder();
		if( modeOrder ) {
			prevFunction = findNextTeam;
		} else {
			prevFunction = findNextSubmit;
			findNextSubmit();
		}
		return getNextFunction();
	}
	if( prevFunction == sortTrNextSubmit ) {
		getModeOrder();
		if( modeOrder ) {
			prevFunction = findNextTeam;
		} else {
			prevFunction = findNextSubmit;
			findNextSubmit();
		}
		return getNextFunction();
	}
}

function onFreezeTime() {
	findNextSubmit();
	if( nextSubmit == submits.length ) {
		updateTable();
		return;
	}
	freezeTime = submits[submits.length - 1].time + 1;
	createTeamsAllSubmit();
	updateTable();
	step = false;
	nextFunction = false;
	showSimulate = true;
	if( modeOrder ) {
		nextTeam = teamPlace.length - 1;
	}
}

function addTimerNextFunction( time ) {
	if( modeStep && showSimulate )
		step = false;
	timerNextFunction = setTimeout( getNextFunction, time );
}

function addNextSubmit() {
	var team = teamId.get( submits[nextSubmit].teamId );
	return addSubmit( team, nextSubmit );
}

function addNextTeamSubmit() {
	var team = teamPlace[nextTeam];
	var submit = teams[team].getIdSubmit();
	return addSubmit( team, submit );
}

function addSubmit( team, submit ) {
	var problem = problemId.get( submits[submit].problemCode );
	submits[submit].checked = true;
	return teams[team].addSubmit( submit );
}

function addNextSubmitInTeam() {
	var team = teamId.get( submits[nextSubmit].teamId );
	return addSubmitInTeam( team, nextSubmit );
}

function addNextTeamSubmitInTeam() {
	var team = teamPlace[nextTeam];
	var submit = teams[team].getIdSubmit();
	return addSubmitInTeam( team, submit );
}

function addSubmitInTeam( team, submit ) {
	submits[submit].checked = true;
	return teams[team].addProblemSubmit( submit );
}

function findNextSubmit() {
	if( nextSubmit == submits.length )
		return;
	var team = teamId.get( submits[nextSubmit].teamId );
	var problem = problemId.get( submits[nextSubmit].problemCode );
	if( team == null || problem == null || submits[nextSubmit].checked || teams[team].problemSolved[problem] ) {
		nextSubmit ++;
		return findNextSubmit();
	}
}

function findNextTeamSubmit() {
	var team = teamPlace[nextTeam];
	if( teams[team].nextSubmit == teams[team].submit.length )
		return;
	var submit = teams[team].getIdSubmit();
	var problem = problemId.get( submits[submit].problemCode );
	if( submits[submit].checked || teams[team].problemSolved[problem] ) {
		teams[team].nextSubmit ++;
		return findNextTeamSubmit();
	}
}

function findNextTeam() {
	if( nextTeam == -1 )
		return;
	nextTeam --;
	/*if( teams[team].nextSubmit == teams[team].submit.length ) {
		nextTeam --;
		return findNextTeam();
	}
	var submit = teams[team].getIdSubmit();
	if( freezeTime < submits[submit].time ) {
		nextTeam --;
		return findNextTeam();
	}*/
}

function checkNextTeamSubmit() {
	var team = teamPlace[nextTeam];
	if( teams[team].nextSubmit == teams[team].submit.length )
		return false;
	var submit = teams[team].getIdSubmit();
	if( freezeTime < submits[submit].time ) {
		return false;
	}
	return true;
}

function compareSortTeamPlace( i, j ) {
	if( teams[i].solved > teams[j].solved )
		return -1;
	if( teams[i].solved < teams[j].solved )
		return 1;
	if( teams[i].time < teams[j].time )
		return -1;
	if( teams[i].time > teams[j].time )
		return 1;
	return 0;
}

function compareSortTeamPlaceForSort( i, j ) {
	var comp = compareSortTeamPlace( i, j );
	if( comp )
		return comp;
	if( teams[i].id < teams[j].id )
		return -1;
	if( teams[i].id > teams[j].id )
		return 1;
	return 0;
}

function sortTeamPlace() {
	teamPlace.sort( compareSortTeamPlaceForSort );
}

function setShowTime() {
	var checkbox = document.getElementById( "showTime" );
	showTime = checkbox.checked;
	updateTableProblem();
}

function setShowSubmit() {
	var checkbox = document.getElementById( "showSubmit" );
	showSubmit = checkbox.checked;
	updateTableProblem();
}

function getShowAllSubmit() {
	var checkbox = document.getElementById( "showAllSubmit" );
	if( showAllSubmit == checkbox.checked )
		return false;
	showAllSubmit = checkbox.checked;
	if( !showAllSubmit ) {
		nextSubmit = 0;
		for( var i = 0; i < teams.length; i ++ ) {
			teams[i].clearProblemSubmits();
		}
	}
	return true;
}

function setModeStep() {
	var radio = document.getElementById( "modeStepOn" );
	if( modeStep == radio.checked )
		return;
	modeStep = radio.checked;
}

function setSpeed() {
	var range = document.getElementById( "speed" );
	speed = - Number( range.value );
}

function getModeOrder() {
	var radio = document.getElementById( "modeOrderSuccessively" );
	if( modeOrder == radio.checked )
		return;
	modeOrder = radio.checked;
	if( modeOrder ) {
		nextTeam = teamPlace.length - 1;
	}
}

function getTime( time ) {
	return parseInt( time ) * 3600 + time[3] * 600 + time[4] * 60;
}

function isTimeCorrect( time ) {
	for( var i = 0; i < time.length; i ++ ) {
		if( time[i] == '-' ) 
			return false;
	}
	return true;
}

function setFreezeTime() {
	var timebox = document.getElementById( "freezeTime" );
	var time = timebox.value;
	if( isTimeCorrect( time ) ) {
		freezeTime = getTime( time );
		createTeamsAllSubmit();
		updateTableProblem();
	}
}

function setScriptLoad( scriptName ) {
	var div = document.getElementById( "scriptLoad" );
	div.removeChild( div.firstChild );
	var script = document.createElement( "script" );
	script.setAttribute( "type", "text/javascript" );
	script.setAttribute( "src", scriptName ); 
	div.appendChild( script );
}

function setMobileVersion() {
	var checkbox = document.getElementById( "mobileVersion" );
	var div = document.getElementById( "touch" );
	if( checkbox.checked ) {
		var input = document.createElement( "input" );
		input.id = "buttonStep";
		input.setAttribute( "type", "button" );
		input.setAttribute( "onclick", "doStep();" );
		input.setAttribute( "value", "Действие" );
		div.appendChild( input );
	} else {
		div.removeChild( div.lastChild );
	}
}

var showSetting = true;

function hideSetting() {
	if( showSetting )
		$( "#setting" ).hide( "slow" );
	else
		$( "#setting" ).show( "slow" );
	showSetting = !showSetting;
}