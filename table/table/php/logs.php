<?php
	include "php/db.php";
	$query = "SELECT * FROM `logs`";
	$res = mysql_query( $query );
	echo "<select id = 'fileLogFromServer'>";
	while( $row = mysql_fetch_array( $res ) ) {
		echo "<option>".$row["name"]."</option>";
	}
	echo "</select>";
?>