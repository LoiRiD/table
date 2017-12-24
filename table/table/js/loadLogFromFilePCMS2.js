function loadLogFromFile( text, teams, problems, submits ) { 
	var log = new StringWithIndex( text );
	while( log.index < log.text.length ) {
		var tag = log.nextTagText();
		if( tag == null ) {
			break;
		}
		if( tag.getTagName() == "challenge" ) {
			getProblemsFromFile( problems, log );
		}
		if( tag.getTagName() == "session" ) {
			getTeamFromFile( teams, submits, tag, log );
		}
		if( tag.getTagName() == "/standings" ) {
			break;
		}
	}
}

function getTeamFromFile( teams, submits, team, log ) {
	var name = team.getParamsValue( "party" );
	var id = teams.length;
	teams.push( new Team( id, name ) );
	while( true ) {
		var tag = log.nextTagText();
		if( tag.getTagName() == "/session" ) 
			break;
		getSubmitFromFile( submits, id, tag, log );
	}
}

function getSubmitFromFile( submits, teamId, problem, log ) {
	var code = problem.getParamsValue( "alias" );
	while( true ) {
		var tag = log.nextTagText();
		if( tag.getTagName() == "/problem" ) 
			break;
		var time = Number( tag.getParamsValue( "time" ) ) / 1000;
		var state = ( tag.getParamsValue( "accepted" ) == "yes" ? "accepted" : "no" );
		submits.push( new Submit( time, teamId, code, state, 0 ) );
	}
}

function getProblemsFromFile( problems, log ) {
	while( true ) {
		var tag = log.nextTagText();
		if( tag.getTagName() == "/challenge" ) 
			break;
		var code = tag.getParamsValue( "alias" );
		problems.push( new Problem( code ) );
	}
}