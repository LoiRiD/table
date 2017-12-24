function loadLogFromFile( text, teams, problems, submits ) {  
	var log = new StringWithIndex( text );
	getTeamsFromFile( teams, log.getTagText( "teams" ) );
	getProblemsFromFile( problems, log.getTagText( "problems" ) );
	getSubmitsFromFile( submits, log.getTagText( "reqs" ) );
}

function getTeamsFromFile( teams, log ) {
	if( log == null )
		return;
	while( true ) {
		var team = log.getNextTagText( "team" );
		if( team == null )
			break;
		var id = parseInt( team.getTagValue( "id" ) );
		var name = team.getTagValue( "name" );
		teams.push( new Team( id, name ) );
	}
}

function getProblemsFromFile( problems, log ) {
	if( log == null )
		return;
	while( true ) {
		var problem = log.getNextTagText( "problem" );
		if( problem == null )
			break;
		var code = problem.getTagValue( "code" );
		problems.push( new Problem( code ) );
	}
}

function getSubmitsFromFile( submits, log ) {
	if( log == null )
		return;
	while( true ) {
		var submit = log.getNextTagText( "req" );
		if( submit == null )
			break;
		var time = 86400 * Number( submit.getTagValue( "time_since_start" ) );
		var teamId = parseInt( submit.getTagValue( "team_id" ) );
		var problem = submit.getTagValue( "code" );
		var state = submit.getTagValue( "state" );
		var test = parseInt( submit.getTagValue( "failed_test" ) );
		submits.push( new Submit( time, teamId, problem, state, test ) );
	}
}