/* global process, __dirname, Promise */

const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 80;

var app = express();
var bodyParser = require('body-parser');

const jsdom = require('jsdom');
const {JSDOM} = jsdom;

var net = require('net');
var server = net.createServer();

// Configuración de la base de datos
var MYSQL_URI = {
    host: 'us-cdbr-gcp-east-01.cleardb.net',
    user: 'bf513a472fe95b',
    password: '18ecf997',
    database: 'gcp_0ec181dd4858ee89399d'
};

var DAOChart = require("./model/daochart.js");
var DAOValor = require("./model/daovalor.js");
var DAOAlert = require("./model/daoalert.js");
var Chart = require("./model/chart.js");
var Alert = require("./model/alert.js");
var daochart = new DAOChart(MYSQL_URI, 'charts');
var daovalor = new DAOValor(MYSQL_URI, 'valores');
var daoalert = new DAOAlert(MYSQL_URI, 'alerts');

// Configuración de la aplicación
app
        .use(express.static(path.join(__dirname, 'public')))
        .use(bodyParser.json())
        .use(bodyParser.urlencoded({extended: false}))
        .set('views', path.join(__dirname, 'views'))
        .set('view engine', 'ejs');

// Página principal
app.get('/', function (req, res) {
    res.status(200).json({
        "ruta": req.protocol + '://' + req.get('host') + req.originalUrl,
        "status": "OK"
    });
});

// Página de información
app.get('/about', function (req, res) {
    res.status(200).json({
        "author": "Felipe Peiró Garrido",
        "status": "OK"
    });
});

// Página para añadir sensores
app.put('/chart', function (req, res) {
    daochart.insert(new Chart(null, req.body.tipo), function (status) {
        if (status === "ERROR")
            err404(null, req, res, null);
        else
            res.status(200).json({
                "message": "Se ha añadido un nuevo sensor de " + req.body.tipo,
                "status": status
            });
    });
});

// Página para modificar sensores
app.post('/chart', function (req, res) {
    daochart.update(new Chart(req.body.id, req.body.tipo), function (status) {
        if (status === "ERROR")
            err404(null, req, res, null);
        else
            res.status(200).json({
                "message": "Se ha modificado el sensor número " + req.body.id,
                "status": status
            });
    });
});

// Página para eliminar sensores
app.delete('/chart', function (req, res) {
    daochart.delete(new Chart(req.query.id, null), function (status) {
        if (status === "ERROR")
            err404(null, req, res, null);
        else
            res.status(200).json({
                "message": "Se ha eliminado el sensor número " + req.query.id,
                "status": status
            });
    });
});

// Página para buscar sensores
app.get('/chart', function (req, res) {
    daochart.find(new Chart(req.query.id, null), function (chart) {
        if (chart === "ERROR")
            err404(null, req, res, null);
        else {
			getLastData(chart.id, function (datov) {
				getAlerts(chart.id, function (datoa) {
					chart.valor = datov;
					var alertMsg = getAlertMsg(datoa, datov);
					let promesa = getCode(req, chart, '/render_s');
					Promise.resolve(promesa).then(function (code) {
						res.status(200).json({
							"message": "Se ha obtenido correctamente 1 sensor",
							"valor": {
								"alerts" : alertMsg,
								"id": chart.id,
								"tipo": chart.tipo,
								"valor": chart.valor,
								"chart": code
							},
							"status": "SUCCESS"
						});
					});
				});
			});
        }
    });
});

// Página para buscar gráficas
app.get('/graph', function (req, res) {
    daochart.find(new Chart(req.query.id, null), function (chart) {
        if (chart === "ERROR")
            err404(null, req, res, null);
        else {
			get100Data(chart.id, function (datosv) {
				getAlerts(chart.id, function (datoa) {
					chart.valores = datosv;
					var alertMsg = getAlertMsgs(datoa, datosv);
					let promesa = getCode(req, chart, '/render_g');
					Promise.resolve(promesa).then(function (code) {
						res.status(200).json({
							"message": "Se ha obtenido correctamente 1 gráfica",
							"valor": {
								"alerts" : alertMsg,
								"id": chart.id,
								"tipo": chart.tipo,
								"valores": chart.valores,
								"graph": code
							},
							"status": "SUCCESS"
						});
					});
				});
			});
        }
    });
});

// Página para resetear los sensores
app.delete('/charts', function (req, res) {
    daochart.deleteAll(function (status) {
        if (status === "ERROR")
            err404(null, req, res, null);
        else
            res.status(200).json({
                "message": "Se han reseteado los sensores",
                "status": status
            });
    });
});

// Página para obtener los sensores
app.get('/charts', function (req, res) {
    daochart.findAll(function (charts) {
        if (charts === "ERROR")
            err404(null, req, res, null);
        else {
			getLastDataAll(charts, 0 , [], function (sdatov) {
				getAlertsAll(charts, 0 , [], function (sdatoa) {
					var counter2 = 0;
					var alertMsgs = [], promesas = [];
					for (var chart of charts) {
						chart.valor = sdatov[counter2];
						alertMsgs.push(getAlertMsg(sdatoa[counter2], sdatov[counter2]));
						let promesa = getCode(req, chart, '/render_s');
						promesas.push(promesa);
						counter2++;
					}
					Promise.all(promesas).then(function (codes) {
						var jsn = {
							"message": "Se han obtenido correctamente los sensores",
							"valores": new Array(),
							"status": "SUCCESS"
						};
						var counter = 0;
						for (chart of charts) {
							counter++;
							var aux = {};
							aux["valor " + counter] = new Array();
							jsn.valores.push(aux);
							jsn.valores[counter - 1]["valor " + counter].push({
								"alerts" : alertMsgs[counter - 1],
								"id": chart.id,
								"tipo": chart.tipo,
								"valor": chart.valor,
								"chart": codes[counter - 1]
							});
						}
						res.status(200).json(jsn);
					});
				});
			});
        }
    });
});


// Página para obtener las gráficas
app.get('/graphs', function (req, res) {
    daochart.findAll(function (charts) {
        if (charts === "ERROR")
            err404(null, req, res, null);
        else {
			get100DataAll(charts, 0 , [], function (sdatosv) {
				getAlertsAll(charts, 0 , [], function (sdatoa) {
					var counter2 = 0;
					var alertMsgs = [], promesas = [];
					for (var chart of charts) {
						chart.valores = sdatosv[counter2];
						alertMsgs.push(getAlertMsgs(sdatoa[counter2], sdatosv[counter2]));
						let promesa = getCode(req, chart, '/render_g');
						promesas.push(promesa);
						counter2++;
					}
					Promise.all(promesas).then(function (codes) {
						var jsn = {
							"message": "Se han obtenido correctamente las gráficas",
							"valores": new Array(),
							"status": "SUCCESS"
						};
						var counter = 0;
						for (chart of charts) {
							counter++;
							var aux = {};
							aux["valor " + counter] = new Array();
							jsn.valores.push(aux);
							jsn.valores[counter - 1]["valor " + counter].push({
								"alerts" : alertMsgs[counter - 1],
								"id": chart.id,
								"tipo": chart.tipo,
								"valores": chart.valores,
								"graph": codes[counter - 1]
							});
						}
						res.status(200).json(jsn);
					});
				});
			});
        }
    });
});

// Página para añadir valores
app.put('/valor', function (req, res) {
    daovalor.insert(req.body.dato, req.body.sensor, function (status) {
        if (status === "ERROR")
            err404(null, req, res, null);
        else
            res.status(200).json({
                "message": "Se ha añadido el valor " + req.body.dato + " al sensor número " + req.body.sensor,
                "status": status
            });
    });
});

// Página para buscar valores por sensor
app.get('/valor', function (req, res) {
    daovalor.find(req.query.sensor, 100, function (datos) {
        if (datos === "ERROR")
            err404(null, req, res, null);
        else {
			var jsn = {
				"message": "Se han obtenido correctamente 100 datos del sensor " + req.query.sensor,
				"valores": {},
				"status": "SUCCESS"
			};
			var counter = 0;
			for (dato of datos) {
				counter++;
				jsn.valores["id " + counter] = dato.dato;
			}
			res.status(200).json(jsn);
        }
    });
});

// Página para resetear los valores
app.delete('/valores', function (req, res) {
    daovalor.deleteAll(function (status) {
        if (status === "ERROR")
            err404(null, req, res, null);
        else
            res.status(200).json({
                "message": "Se han reseteado los valores",
                "status": status
            });
    });
});

// Página para añadir alertas
app.put('/alert', function (req, res) {
    daoalert.insert(new Alert(null, req.body.tipo, req.body.sensor, req.body.dato), function (status) {
        if (status === "ERROR")
            err404(null, req, res, null);
        else
            res.status(200).json({
                "message": "Se ha añadido una alerta al sensor número " + req.body.sensor,
                "status": status
            });
    });
});

// Página para modificar alertas
app.post('/alert', function (req, res) {
    daoalert.update(new Alert(req.body.id, req.body.tipo, req.body.sensor, req.body.dato), function (status) {
        if (status === "ERROR")
            err404(null, req, res, null);
        else
            res.status(200).json({
                "message": "Se ha modificado la alerta número " + req.body.id,
                "status": status
            });
    });
});

// Página para eliminar alertas
app.delete('/alert', function (req, res) {
    daoalert.delete(req.query.id, function (status) {
        if (status === "ERROR")
            err404(null, req, res, null);
        else
            res.status(200).json({
                "message": "Se ha eliminado la alerta número " + req.query.id,
                "status": status
            });
    });
});

// Página para buscar alertas por sensor
app.get('/alert', function (req, res) {
    daoalert.find(req.query.sensor, function (datos) {
        if (datos === "ERROR")
            err404(null, req, res, null);
        else {
			var jsn = {
				"message": "Se han obtenido correctamente las alertas del sensor " + req.query.sensor,
				"valores": {},
				"status": "SUCCESS"
			};
			var counter = 0;
			for (dato of datos) {
				counter++;
				jsn.valores["id " + counter] = dato;
			}
			res.status(200).json(jsn);
        }
    });
});

// Página para resetear las alertas
app.delete('/alerts', function (req, res) {
    daoalert.deleteAll(function (status) {
        if (status === "ERROR")
            err404(null, req, res, null);
        else
            res.status(200).json({
                "message": "Se han reseteado las alertas",
                "status": status
            });
    });
});

// Renderización del sensor
app.get('/render_s', function (req, res) {
    res.status(200).render('pages/render_s');
});

// Renderización del gráfico
app.get('/render_g', function (req, res) {
    res.status(200).render('pages/render_g');
});

// Obtención del código del sensor
function getCode(req, chart, type) {
    var parms = [];
    var jsn = JSON.parse(JSON.stringify(chart));
    for (var i in jsn) {
        parms.push(i + '=' + JSON.stringify(jsn[i]).replace(/['"]+/g, ''));
    }
    var origUrl = req.protocol + '://' + req.get('host') + type + '?' + parms.join('&');
    return new Promise(function (resolve, reject) {
        JSDOM.fromURL(origUrl, {runScripts: "dangerously", resources: "usable"}).then(dom => {
            var code = "", strcode = "";
            (function loop() {
                setTimeout(function () {
                    code = dom.window.document.getElementsByTagName('html')[0].innerHTML;
                    strcode = code.substring(code.indexOf('<svg'), code.indexOf('/svg') + 5);
                    code.indexOf('<svg') !== -1 ? resolve(strcode) : loop();
                }, 250);
            }());
        });
    });
}

// Obtención del mensaje de alerta
function getAlertMsg(alerts, datav) {
	var messages = [];
	for (var alert of alerts) {
		switch (alert.tipo) {
			case "mayor":
				if (datav > alert.dato) messages.push("El sensor está superando el valor " + alert.dato + " indicado.");
				break;
			case "menor":
				if (datav < alert.dato) messages.push("El sensor no está superando el valor " + alert.dato + " indicado.");
				break;
			case "mayorigual":
				if (datav >= alert.dato) messages.push("El sensor está superando el valor " + alert.dato + " indicado.");
				break;
			case "menorigual":
				if (datav <= alert.dato) messages.push("El sensor no está superando el valor " + alert.dato + " indicado.");
				break;
			case "igual":
				if (datav == alert.dato) messages.push("El sensor está mostrando el valor " + alert.dato + " indicado.");
				break;
			case "noigual":
				if (datav != alert.dato) messages.push("El sensor no está mostrando el valor " + alert.dato + " indicado.");
				break;
			default:
				break;
		}
	}
	return messages;
}

// Obtención de los mensajes de alerta
function getAlertMsgs(alerts, data) {
	var messages = [];
	for (var datav of data) {
		for (var alert of alerts) {
			switch (alert.tipo) {
				case "mayor":
					if (datav[1] > alert.dato) messages.push("El sensor ha superado en el instante " + datav[0] + " el valor " + alert.dato + " indicado.");
					break;
				case "menor":
					if (datav[1] < alert.dato) messages.push("El sensor no ha superado en el instante " + datav[0] + " el valor " + alert.dato + " indicado.");
					break;
				case "mayorigual":
					if (datav[1] >= alert.dato) messages.push("El sensor ha superado en el instante " + datav[0] + " el valor " + alert.dato + " indicado.");
					break;
				case "menorigual":
					if (datav[1] <= alert.dato) messages.push("El sensor no ha superado en el instante " + datav[0] + " el valor " + alert.dato + " indicado.");
					break;
				case "igual":
					if (datav[1] == alert.dato) messages.push("El sensor ha mostrado en el instante " + datav[0] + " el valor " + alert.dato + " indicado.");
					break;
				case "noigual":
					if (datav[1] != alert.dato) messages.push("El sensor no ha mostrado en el instante " + datav[0] + " el valor " + alert.dato + " indicado.");
					break;
				default:
					break;
			}
		}
	}
	return messages;
}

// Obtención del último dato de un sensor
function getLastData(sensor, callback) {
	daovalor.find(sensor, 1, function (datos) {
		if (datos === "ERROR")
			callback(NaN);
		else
			callback(datos[0].dato);
    });
}

// Obtención de los últimos 100 datos de un sensor
function get100Data(sensor, callback) {
	daovalor.find(sensor, 100, function (datos) {
		var arr = [];
		if (datos !== "ERROR") {
			var counter = datos.length;
			for (dato of datos) {
				arr.push([counter, dato.dato]);
				counter--;
			}
		}
		callback(arr);
    });
}

// Obtención del último dato de los sensores
function getLastDataAll(sensores, i, garr, callback) {
	if (i < sensores.length) {
		daovalor.find(sensores[i].id, 1, function (datos) {
			if (datos === "ERROR")
				garr.push(NaN);
			else
				garr.push(datos[0].dato);
			getLastDataAll(sensores, ++i, garr, callback);
		});
	} else
		callback(garr);
}

// Obtención de los últimos 100 datos de los sensores
function get100DataAll(sensores, i, garr, callback) {
	if (i < sensores.length) {
		daovalor.find(sensores[i].id, 100, function (datos) {
			var arr = [];
			if (datos !== "ERROR") {
				var counter = datos.length;
				for (dato of datos) {
					arr.push([counter, dato.dato]);
					counter--;
				}
			}
			garr.push(arr);
			get100DataAll(sensores, ++i, garr, callback);
		});
	} else
		callback(garr);
}

// Obtención de las alertas de un sensor
function getAlerts(sensor, callback) {
	daoalert.find(sensor, function (datos) {
		var arr = [];
		if (datos !== "ERROR") {
			arr = datos;
		}
		callback(arr);
    });
}

// Obtención de las alertas de todos los sensores
function getAlertsAll(sensores, i, garr, callback) {
	if (i < sensores.length) {
		daoalert.find(sensores[i].id, function (datos) {
			var arr = [];
			if (datos !== "ERROR") {
				arr = datos;
			}
			garr.push(arr);
			getAlertsAll(sensores, ++i, garr, callback);
		});
	} else
		callback(garr);
}

// Página por defecto
app.get('*', function (req, res) {
    throw new Error();
});

// Gestión de error 404
function err404(err, req, res, next) {
    res.status(404).json({
        "message": 'La URL ' + req.protocol + '://' + req.get('host') + req.originalUrl + ' no corresponde a ningún recurso disponible.',
        "status": "NOT_EXISTS"
    });
}
app.use(err404);

// Gestión de error 405
function err405(err, req, res, next) {
    res.status(405).json({
        "message": 'No tiene permiso para realizar ' + req.method + 'sobre la URL' + req.protocol + '://' + req.get('host') + req.originalUrl,
        "status": "FORBIDDEN"
    });
}
app.use(err405);

// Ejecución del servidor
server.once('error', function(err) {
  if (err.code === 'EADDRINUSE') {
  app.listen(5000, () => console.log(`Listening on 5000`));
  }
});

server.once('listening', function() {
  server.close();
  app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
});

server.listen(PORT);

module.exports = app;
