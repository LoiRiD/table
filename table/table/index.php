<!DOCTYPE html>
<html>
	<head>
		<meta charset = "UTF-8">
		
		<script type = "text/javascript" src = "js/table.js"></script>
		<script type = "text/javascript" src = "js/createTable.js"></script>
		<script type = "text/javascript" src = "js/updateTable.js"></script>
		<script type = "text/javascript" src = "js/class Team.js"></script>
		<script type = "text/javascript" src = "js/class Problem.js"></script>
		<script type = "text/javascript" src = "js/class Submit.js"></script>
		<script type = "text/javascript" src = "js/class StringWithIndex.js"></script>
		
		<script type = "text/javascript" src = "//code.jquery.com/jquery-1.12.0.min.js"></script>
		<script type = "text/javascript" src = "//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
		
		<link rel = "stylesheet" type = "text/css" href = "css/table.css">
		<link rel = "stylesheet" type = "text/css" href = "css/setting.css">
	</head>
	<body>
		<div id = "scriptLoad"><script type = "text/javascript" src = "js/loadLogFromFilePCMS2.js"></script></div>
		<div id = "setting">
			<table class = "tableSetting">
				<thead class = "tableSettingHead">
					<tr>
						<td colspan = "2">Настройки</td>
					</tr>
				</thead>
				<tbody class = "tableSettingBody">
					<tr>
						<td>Формат лога</td>
						<td>
							<input type = "radio" name = "scriptLoad" id = "loadPCMS2" onchange = "setScriptLoad( 'js/loadLogFromFilePCMS2.js' );" checked>PCMS2</input>
							<br>
							<input type = "radio" name = "scriptLoad" id = "loadCats" onchange = "setScriptLoad( 'js/loadLogFromFileCATS+.js' );" >CATS+</input>
						</td>
					</tr>
					<tr>
						<td>Загрузить лог с компьютера</td>
						<td>
							<input type = "file" id = "fileLog"></input>
							<br>
							<input type = "button" id = "loadLogFromUser" onclick = "loadLogFromUser();" value = "Загрузить"></input>
						</td>
					</tr>
					<tr>
						<td>Загрузить лог с сервера</td>
						<td>
							<?php include "php/logs.php"; ?>
							<br>
							<input type = "button" id = "loadLogFromServer" onclick = "loadLogFromServer();" value = "Загрузить"></input>
						</td>
					</tr>
					<tr>
						<td>Время заморозки</td>
						<td>
							<input type = "time" id = "freezeTime" onchange = "setFreezeTime();" value = "04:00" min = "00:00" max = "06:00"></input>
							<br>
							<input type = "button" id = "goFreezeTime" onclick = "goFreezeTime();" value = "Перейти на момент заморозки"></input>
							<br>
							<input type = "button" id = "goStart" onclick = "goStart();" value = "Перейти на начало"></input>
						</td>
					</tr>
					<tr>
						<td>Скорость</td>
						<td>
							<input type = "range" id = "speed" onchange = "setSpeed();" min = "-2000" max = "-5" value = "-500"></input>
						</td>
					</tr>
					<tr>
						<td>Порядок разморозки</td>
						<td>
							<input type = "radio" name = "modeOrder" id = "modeOrderSuccessively" checked>Последовательно</input>
							<br>
							<input type = "radio" name = "modeOrder" id = "modeOrderChronology">Хронологически</input>
						</td>
					</tr>
					<tr>
						<td>Режим разморозки</td>
						<td>
							<input type = "radio" name = "modeStep" id = "modeStepOn" onchange = "setModeStep();" checked>Пошаговый</input>
							<br>
							<input type = "radio" name = "modeStep" id = "modeStepOff" onchange = "setModeStep();" >Автоматический</input>
						</td>
					</tr>
					<tr>
						<td>Дополнительные настройки</td>
						<td>
							<input type = "checkbox" id = "showTime" onchange = "setShowTime();" checked>Показывать время</input>
							<br>
							<input type = "checkbox" id = "showSubmit" onchange = "setShowSubmit();">Показывать посылки</input>
							<br>
							<input type = "checkbox" id = "showAllSubmit">Только последняя посылка</input>
						</td>
					</tr>
				</tbody>
			</table>			
		</div>
		<div>
			<input type = "button" id = "buttonSetting" onclick = "hideSetting();" class = "buttonStyle"></input>
			<input type = "button" id = "buttonStep" onclick = "doStep();" class = "buttonStyle"></input>
		</div>
		<div class = "copyright">
			FreezeTable v 1.0 (c) Copyright 2015-2016 Алексей Усманов
		</div>
		<div id = "printTable"></div>
	</body>
</html>