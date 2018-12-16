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
var Chart = require("./model/chart.js");
var daochart = new DAOChart(MYSQL_URI, 'charts');
var daovalor = new DAOValor(MYSQL_URI, 'valores');

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
			getLastData(chart.id, function (dato) {
				chart.valor = dato;
				let promesa = getCode(req, chart, '/render_s');
				Promise.resolve(promesa).then(function (code) {
					res.status(200).json({
						"message": "Se ha obtenido correctamente 1 sensor",
						"valor": {
							"id": chart.id,
							"tipo": chart.tipo,
							"valor": chart.valor,
							"chart": code
						},
						"status": "SUCCESS"
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
			get100Data(chart.id, function (datos) {
				chart.valores = datos;
				let promesa = getCode(req, chart, '/render_g');
				Promise.resolve(promesa).then(function (code) {
					res.status(200).json({
						"message": "Se ha obtenido correctamente 1 gráfica",
						"valor": {
							"id": chart.id,
							"tipo": chart.tipo,
							"valores": chart.valores,
							"graph": code
						},
						"status": "SUCCESS"
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
			getLastDataAll(charts, 0 , [], function (sdato) {
				var promesas = [];
				var counter2 = 0;
				for (var chart of charts) {
					chart.valor = sdato[counter2];
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
							"id": chart.id,
							"tipo": chart.tipo,
							"valor": chart.valor,
							"chart": codes[counter - 1]
						});
					}
					res.status(200).json(jsn);
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
			get100DataAll(charts, 0 , [], function (sdatos) {
				var promesas = [];
				var counter2 = 0;
				for (var chart of charts) {
					chart.valores = sdatos[counter2];
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
							"id": chart.id,
							"tipo": chart.tipo,
							"valores": chart.valores,
							"graph": codes[counter - 1]
						});
					}
					res.status(200).json(jsn);
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
