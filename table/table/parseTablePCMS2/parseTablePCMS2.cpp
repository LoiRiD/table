#include <bits/stdc++.h>

using namespace std;

// время 300, если нет
// соединение нескольких строках

bool in( int x, int l, int r ) {
	return ( l <= x && x <= r );
}

int getNum( string &line, int &idx ) {
	int res = 0;
	while( idx < line.size() && !in( line[idx], '0', '9' ) )
		idx ++;
	while( idx < line.size() && in( line[idx], '0', '9' ) ) {
		int c = line[idx] - '0';
		res *= 10;
		res += c;
		idx ++;
	}
	return res;
}

int getTime( string &line, int &idx ) {
	int minutes = getNum( line, idx );
	return minutes;
}

struct submit {
	bool ok;
	bool freeze;
	int cntFail;
	int time;
	int timeFail;

	submit() {
		ok = false;
		freeze = false;
		cntFail = 0;
		time = 0;
	}
	submit( string &sub ) {
		if( sub == "." ) {
			ok = false;
			freeze = false;
			cntFail = 0;
			time = 0;
			return;
		}
		int idx = 0;
		freeze = false;
		if( sub[idx] == '?' ) {
			freeze = true;
			idx ++;
		} else {
			freeze = false;
		}
		if( sub[idx] == '+' ) {
			ok = true;
			idx ++;
		} else if( sub[idx] == '-' ) {
			ok = false;
			idx ++;
		} else {
			ok = false;
		}
		if( sub[idx] != ' ' )
			cntFail = getNum( sub, idx );
		else
			cntFail = 0;
		if( !ok ) {
			if( freeze )
				timeFail = 300;
			else
				timeFail = 0; //*
		} else {
			time = getTime( sub, idx );
			if( freeze )
				timeFail = time - 1;
			else
				timeFail = 0; //*
		}
	}
};

struct team {
	string name;
	vector< submit > submits;

	team() {}
	team( string &line, int problemCnt ) {
		int idx = 0;
		while( idx < line.size() && line[idx] != '\t' )
			idx ++;
		idx ++;
		name = "";
		while( idx < line.size() && line[idx] != '\t' ) {
			name += line[idx];
			idx ++;
		}
		idx ++;
		for( int i = 0; i < problemCnt; i ++ ) {
			string sub = "";
			bool ok = false;
			while( idx < line.size() && line[idx] != '\t' ) {
				if( line[idx] == '+' )
					ok = true;
				sub += line[idx];
				idx ++;
			}
			idx ++;
			if( ok ) {
				sub += ' ';
				while( idx < line.size() && line[idx] != '\t' ) {
					sub += line[idx];
					idx ++;
				}
				idx ++;
			}
			addSubmit( sub );
		}
	}
	void addSubmit( string &sub ) {
		submits.push_back( submit( sub ) );
	}
};

vector< team > readTable( char file[] ) {
	freopen( file, "r", stdin );
	int teamCnt;
	int problemCnt;
	cin >> teamCnt;
	cin >> problemCnt;
	string line;
	getline( cin, line );
	vector< team > teams;
	for( int i = 0; i < teamCnt; i ++ ) {
		string teamLine = "";
		int cntCurrentTabs = 0;
		int cntTabs = problemCnt + 4;
		while( cntCurrentTabs < cntTabs ) {
			getline( cin, line );
			teamLine += line;
			if( teamLine[teamLine.size() - 1] != '\t' ) {
				teamLine += '\t';
				cntCurrentTabs ++;
			}
			for( int j = 0; j < line.size(); j ++ ) {
				if( line[j] == '\t' )
					cntCurrentTabs ++;
				if( cntCurrentTabs > 2 && line[j] == '+' )
					cntTabs ++;
			}
		}
		cout << "New Command: " << i+1 << endl;
		cout << teamLine << endl;
		teams.push_back( team( teamLine, problemCnt ) );
	}
	return teams;
}

char getNameProblem( int id ) {
	return id + 'A';
}

void genLog( vector< team > &teams, char file[] ) {
	freopen( file, "w", stdout );
	cout << "<?xml version=\"1.0\" encoding=\"windows-1251\" ?>" << endl;
	cout << "<standings>" << endl;
	cout << "\t<contest name=\"\" >" << endl;
	cout << "\t\t<challenge>" << endl;
	for( int i = 0; i < teams[0].submits.size(); i ++ ) {
		char c = getNameProblem( i );
		cout << "\t\t\t<problem alias=\"" << c << "\" />" << endl;
	}
	cout << "\t\t</challenge>" << endl;
	for( int i = 0; i < teams.size(); i ++ ) {
		cout << "\t\t<session id=\"" << i << "\" " << "party=\"" << teams[i].name << "\" >" << endl;
		for( int j = 0; j < teams[i].submits.size(); j ++ ) {
			cout << "\t\t\t<problem alias=\"" << getNameProblem( j ) << "\" >" << endl;
			for( int k = 0; k < teams[i].submits[j].cntFail; k ++ ) {
				cout << "\t\t\t\t<run accepted=\"no\" time=\"" << teams[i].submits[j].timeFail << "\" />" << endl;
			}
			if( teams[i].submits[j].ok ) {
				cout << "\t\t\t\t<run accepted=\"yes\" time=\"" << teams[i].submits[j].time << "\" />" << endl;
			}
			cout << "\t\t\t</problem>" << endl;
		}
		cout << "\t\t</session>" << endl;
	}
	cout << "\t</contest>" << endl;
	cout << "</standings>" << endl;
}

int main() {
	vector< team > teams = readTable( "log2.txt" );
	genLog( teams, "log2.xml" );
	return 0;
}
