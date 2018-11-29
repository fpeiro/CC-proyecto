/* global process, __dirname, Promise */

const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 80 || 5000;

var app = express();
var bodyParser = require('body-parser');

const jsdom = require('jsdom');
const {JSDOM} = jsdom;

// Configuración de la base de datos
var MYSQL_URI = {
    host: 'us-cdbr-gcp-east-01.cleardb.net',
    user: 'bf513a472fe95b',
    password: '18ecf997',
    database: 'gcp_0ec181dd4858ee89399d'
};
var NOMBRE_TABLA = 'charts';

var DAOChart = require("./model/daochart.js");
var Chart = require("./model/chart.js");
var daochart = new DAOChart(MYSQL_URI, NOMBRE_TABLA);

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
            let promesa = getCode(req, chart, '/render_s');
            Promise.resolve(promesa).then(function (code) {
                res.status(200).json({
                    "message": "Se ha obtenido correctamente 1 sensor",
                    "valor": {
                        "id": chart.id,
                        "tipo": chart.tipo,
                        "chart": code
                    },
                    "status": "SUCCESS"
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
            var promesas = [];
            for (var chart of charts) {
                let promesa = getCode(req, chart, '/render_s');
                promesas.push(promesa);
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
                        "chart": codes[counter - 1]
                    });
                }
                res.status(200).json(jsn);
            });
        }
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
        parms.push(encodeURIComponent(i) + '=' + encodeURIComponent(jsn[i]));
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
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

module.exports = app;
