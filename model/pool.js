// Configuración de la base de datos
var mysql = require('mysql');

var DAOChart = require("./daochart.js");
var DAOValor = require("./daovalor.js");
var DAOAlert = require("./daoalert.js");

var pool = mysql.createPool({
    host: 'us-cdbr-gcp-east-01.cleardb.net',
    user: 'bf513a472fe95b',
    password: '18ecf997',
    database: 'gcp_0ec181dd4858ee89399d'
});

var daochart = new DAOChart(pool, 'charts');
var daovalor = new DAOValor(pool, 'valores');
var daoalert = new DAOAlert(pool, 'alerts');

module.exports = {daochart, daovalor, daoalert}