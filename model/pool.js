// Configuración de la base de datos
var mysql = require('mysql');

var DAOChart = require("./daochart.js");
var DAOValor = require("./daovalor.js");
var DAOAlert = require("./daoalert.js");
var DAOUser = require("./daouser.js");

var pool = mysql.createPool({
    host: process.env.MYSQL_HOST || '10.0.0.5',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'ccproyecto'
});

var daochart = new DAOChart(pool, 'charts');
var daovalor = new DAOValor(pool, 'valores');
var daoalert = new DAOAlert(pool, 'alerts');
var daouser = new DAOUser(pool, 'users');

module.exports = {daochart, daovalor, daoalert, daouser}