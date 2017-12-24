<?php
	$dbhost = 'localhost';
	$dbname = 'table';
	$dbuser = 'root';
	$dbpass = '';
	$connection = mysql_connect( $dbhost, $dbuser, $dbpass ) or die( mysql_error() );
	mysql_select_db( $dbname, $connection ) or die( mysql_error() );
?>