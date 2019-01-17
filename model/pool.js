// Configuración de la base de datos
var mysql = require('mysql');

var DAOChart = require("./daochart.js");
var DAOValor = require("./daovalor.js");
var DAOAlert = require("./daoalert.js");

var pool = mysql.createPool({
    host: '10.0.0.5',
    user: 'root',
    password: '',
    database: 'ccproyecto'
});

var daochart = new DAOChart(pool, 'charts');
var daovalor = new DAOValor(pool, 'valores');
var daoalert = new DAOAlert(pool, 'alerts');

module.exports = {daochart, daovalor, daoalert}