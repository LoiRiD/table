<?php
	$file = $_GET["file"];
	echo file_get_contents( "C:/openServer/domains/table/log/".$file );
?>