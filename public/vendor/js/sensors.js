/* global google */

google.charts.load('current', {'packages': ['gauge']});
google.charts.setOnLoadCallback(drawChart);

var url = new URL(window.location.href);
var dato = parseInt(url.searchParams.get("valor"));
var item = url.searchParams.get("tipo");

function drawChart() {
    var optTemp = {
        redFrom: 45, redTo: 55,
        yellowFrom: 35, yellowTo: 45,
        greenFrom: -35, greenTo: 0,
        greenColor: "0CB7F2",
        min: -35, max: 55,
        minorTicks: 5
    };

    var optPresAt = {
        min: 960, max: 1060,
        minorTicks: 5
    };

    var optLum = {
        greenFrom: 0,
        greenTo: 1,
        greenColor: "#252440",
        yellowFrom: 1,
        yellowTo: 10,
        yellowColor: "0CB7F2",
        redFrom: 10,
        redTo: 100,
        redColor: "#F5F35B"
    };

    var optViento = {
        redFrom: 90, redTo: 150,
        yellowFrom: 60, yellowTo: 90,
        greenFrom: 50, greenTo: 60,
        greenColor: "#F5F35B"
    };

    var dataTemp = google.visualization.arrayToDataTable([
        ['Label', 'Value'],
        ['ºC', dato]
    ]);
    var dataHum = google.visualization.arrayToDataTable([
        ['Label', 'Value'],
        ['%', dato]
    ]);
    var dataPresAt = google.visualization.arrayToDataTable([
        ['Label', 'Value'],
        ['mbar', dato]
    ]);
    var dataLum = google.visualization.arrayToDataTable([
        ['Label', 'Value'],
        ['lux', dato]
    ]);
    var dataViento = google.visualization.arrayToDataTable([
        ['Label', 'Value'],
        ['km/h', dato]
    ]);
    var data = google.visualization.arrayToDataTable([
        ['Label', 'Value'],
        ['-', dato]
    ]);

    var elmnt = document.getElementById('sensores');
    var chart = new google.visualization.Gauge(elmnt);

    if (item === 'temperatura') {
        chart.draw(dataTemp, optTemp);
    } else if (item === 'humedad') {
        chart.draw(dataHum);
    } else if (item === 'presion') {
        chart.draw(dataPresAt, optPresAt);
    } else if (item === 'luminiscencia') {
        chart.draw(dataLum, optLum);
    } else if (item === 'velviento') {
        chart.draw(dataViento, optViento);
    } else {
        chart.draw(data);
    }
}