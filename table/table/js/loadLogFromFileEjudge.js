function loadLogFromFile( text, teams, problems, submits ) { 
	var log = new StringWithIndex( text );
	while( log.index < log.text.length ) {
		var tag = log.nextTagText();
		if( tag == null ) {
			break;
		}
		if( tag.getTagName() == "users" ) {
			getTeamFromFile( teams, log );
		}
		if( tag.getTagName() == "problems" ) {
			getProblemsFromFile( problems, log );
		}
		if( tag.getTagName() == "runs" ) {
			getSubmitFromFile( submits, log );
		}
		if( tag.getTagName() == "/runlog" ) {
			break;
		}
	}
}

function getTeamFromFile( teams, log ) {
	while( true ) {
		var tag = log.nextTagText();
		if( tag.getTagName() == "/users" ) 
			break;
		var id = tag.getParamsValue( "id" );
		var name = tag.getParamsValue( "name" );
		teams.push( new Team( id, name ) );
	}
}

function getSubmitFromFile( submits, log ) {
	while( true ) {
		var tag = log.nextTagText();
		if( tag.getTagName() == "/runs" ) 
			break;
		var time = Number( tag.getParamsValue( "time" ) );
		var teamId = tag.getParamsValue( "user_id" );
		var code = tag.getParamsValue( "prob_id" );
		var state = ( tag.getParamsValue( "status" ) == "OK" ? "accepted" : "no" );
		var test = tag.getParamsValue( "test" );
		submits.push( new Submit( time, teamId, code, state, test ) );
	}
}

function getProblemsFromFile( problems, log ) {
	while( true ) {
		var tag = log.nextTagText();
		if( tag.getTagName() == "/problems" ) 
			break;
		var code = tag.getParamsValue( "id" );
		problems.push( new Problem( code ) );
	}
}