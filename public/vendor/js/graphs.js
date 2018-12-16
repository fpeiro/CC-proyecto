/* global google */

google.charts.load('current', {'packages': ['corechart']});
google.charts.setOnLoadCallback(drawChart);

var url = new URL(window.location.href);
var datos = JSON.parse(url.searchParams.get("valores"));

function drawChart() {

	var data = new google.visualization.DataTable();
	data.addColumn('number', 'Número de lectura');
	data.addColumn('number', 'Valor');
	data.addRows(datos);
	var chart = new google.visualization.LineChart(document.getElementById('graficos'));
	chart.draw(data);
	
}