function StringWithIndex( text ) {
	this.text = text;
	this.index = 0;
}

StringWithIndex.prototype.getNextTagValue = function( tag ) {
	var left = this.text.indexOf( "<" + tag + ">", this.index ) + 2 + tag.length;
	var right = this.text.indexOf( "</" + tag + ">", this.index );
	if( left == -1 || right == -1 )
		return;
	this.index = right + 3 + tag.length;
	return this.text.slice( left, right );
}

StringWithIndex.prototype.getTagValue = function( tag ) {
	var index = this.index;
	var text = this.getNextTagValue( tag );
	this.index = index;
	if( text == null )
		return;
	return text;
} 

StringWithIndex.prototype.getTagText = function( tag ) {
	var text = this.getTagValue( tag );
	if( text == null )
		return;
	return new StringWithIndex( text );
}

StringWithIndex.prototype.getNextTagText = function( tag ) {
	var text = this.getNextTagValue( tag );
	if( text == null )
		return;
	return new StringWithIndex( text );
}

StringWithIndex.prototype.nextTagText = function() {
	var left = this.text.indexOf( "<", this.index );
	var right = this.text.indexOf( ">", this.index );
	if( left == -1 || right == -1 )
		return;
	this.index = right + 1;
	return new StringWithIndex( this.text.slice( left, right + 1 ) );
}

function checkSymbol( sym ) {
	var symbol = [ '<', '>', ' ' ];
	for( var i = 0; i < symbol.length; i ++ ) {
		if( sym == symbol[i] ) {
			return true;
		}
	}
	return false;
}

StringWithIndex.prototype.getTagName = function() {
	var i = 0;
	while( i < this.text.length && checkSymbol( this.text[i] ) ) {
		i ++;
	}
	var res = "";
	while( i < this.text.length && !checkSymbol( this.text[i] ) ) {
		res += this.text[i];
		i ++;
	}
	return res;
}

StringWithIndex.prototype.getParamsValue = function( key ) {
	var start = this.text.indexOf( key, this.index );
	if( start == -1 )
		return;
	var left = this.text.indexOf( "\"", start );
	var right = this.text.indexOf( "\"", left + 1 );
	if( left == -1 || right == -1 )
		return;
	return this.text.slice( left + 1, right );
}