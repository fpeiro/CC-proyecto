var mysql = require('mysql');
var Chart = require("./chart.js");

// Constructor de la clase
function DAOChart(MYSQL_URI, NOMBRE_TABLA) {
    this.MYSQL_URI = MYSQL_URI;
    this.NOMBRE_TABLA = NOMBRE_TABLA;
    con = mysql.createConnection(MYSQL_URI);
    con.on('error', function (err) {
        con = mysql.createConnection(MYSQL_URI);
    });
    createTable(NOMBRE_TABLA);
}

// Creación de la tabla CHART
function createTable(MYSQL_URI, NOMBRE_TABLA) {
    var sql = `CREATE TABLE IF NOT EXISTS ` + NOMBRE_TABLA + `(
			id int primary key auto_increment,
			tipo varchar(255) not null
		)`;
    con.query(sql, function (err, result) {
        if (err)
            throw err;
    });
}

// Inserción de charts
DAOChart.prototype.insert = function insert(chart, callback) {
    var sql = "INSERT INTO " + this.NOMBRE_TABLA + " (tipo) VALUES (?)";
    con.query(sql, chart.tipo, function (err, result) {
        if (callback) {
            if (err)
                callback('ERROR');
            else
                callback('SUCCESS');
        }
    });
};

// Actualización de charts
DAOChart.prototype.update = function update(chart, callback) {
    var sql = "UPDATE " + this.NOMBRE_TABLA + " SET tipo = ? WHERE id = ?";
    con.query(sql, [chart.tipo, chart.id], function (err, result) {
        if (callback) {
            if (err || result.affectedRows === 0)
                callback('ERROR');
            else
                callback('SUCCESS');
        }
    });
};

// Eliminación de charts
DAOChart.prototype.delete = function del(chart, callback) {
    var sql = "DELETE FROM " + this.NOMBRE_TABLA + " WHERE id = ?";
    con.query(sql, chart.id, function (err, result) {
        if (callback) {
            if (err || result.affectedRows === 0)
                callback('ERROR');
            else
                callback('SUCCESS');
        }
    });
};

// Búsqueda de charts
DAOChart.prototype.find = function find(chart, callback) {
    var sql = "SELECT * FROM " + this.NOMBRE_TABLA + " WHERE id = ?";
    con.query(sql, chart.id, function (err, result) {
        if (callback) {
            if (typeof result !== 'undefined' && result.length > 0)
                callback(new Chart(result[0].id, result[0].tipo));
            else
                callback('ERROR');
        }
    });
};

// Reseteo de charts
DAOChart.prototype.deleteAll = function deleteAll(callback) {
    var sql = "DELETE FROM " + this.NOMBRE_TABLA;
    con.query(sql, function (err, result) {
        if (callback) {
            if (err)
                callback('ERROR');
            else
                callback('SUCCESS');
        }
    });
};

// Volcado de charts
DAOChart.prototype.findAll = function findAll(callback) {
    var sql = "SELECT * FROM " + this.NOMBRE_TABLA;
    con.query(sql, function (err, result) {
        if (callback) {
            if (typeof result !== 'undefined')
                callback(result);
            else
                callback('ERROR');
        }
    });
};

// Creación de datos para test
DAOChart.prototype.initialize = function initialize(callback) {
    var sql = "INSERT IGNORE INTO " + this.NOMBRE_TABLA + " (id, tipo) VALUES (31, 'humedad')";
    con.query(sql, function (err, result) {
        if (callback) {
            if (err)
                callback('ERROR');
            callback('SUCCESS');
        }
    });
};

module.exports = DAOChart;