var mysql = require('mysql');
var Chart = require("./chart.js");

// Constructor de la clase
function DAOChart(MYSQL_URI, NOMBRE_TABLA) {
    this.MYSQL_URI = MYSQL_URI;
    this.NOMBRE_TABLA = NOMBRE_TABLA;
    pool = mysql.createPool(MYSQL_URI);
    createTable(NOMBRE_TABLA);
}

// Creación de la tabla CHART
function createTable(NOMBRE_TABLA) {
    var sql = `CREATE TABLE IF NOT EXISTS ` + NOMBRE_TABLA + `(
			id int primary key auto_increment,
			tipo varchar(255) not null
		)`;
		pool.getConnection(function (err, con) {
		con.query(sql, function (err, result) {
			if (err)
				throw err;
		});
		con.release();
    });
}

// Inserción de charts
DAOChart.prototype.insert = function insert(chart, callback) {
    var sql = "INSERT INTO " + this.NOMBRE_TABLA + " (tipo) VALUES (?)";
	pool.getConnection(function (err, con) {
		con.query(sql, chart.tipo, function (err, result) {
			if (callback) {
				if (err)
					callback('ERROR');
				else
					callback('SUCCESS');
			}
		});
		con.release();
    });
};

// Actualización de charts
DAOChart.prototype.update = function update(chart, callback) {
    var sql = "UPDATE " + this.NOMBRE_TABLA + " SET tipo = ? WHERE id = ?";
	pool.getConnection(function (err, con) {
		con.query(sql, [chart.tipo, chart.id], function (err, result) {
			if (callback) {
				if (err || result.affectedRows === 0)
					callback('ERROR');
				else
					callback('SUCCESS');
			}
		});
		con.release();
    });
};

// Eliminación de charts
DAOChart.prototype.delete = function del(chart, callback) {
    var sql = "DELETE FROM " + this.NOMBRE_TABLA + " WHERE id = ?";
	pool.getConnection(function (err, con) {
		con.query(sql, chart.id, function (err, result) {
			if (callback) {
				if (err || result.affectedRows === 0)
					callback('ERROR');
				else
					callback('SUCCESS');
			}
		});
		con.release();
    });
};

// Búsqueda de charts
DAOChart.prototype.find = function find(chart, callback) {
    var sql = "SELECT * FROM " + this.NOMBRE_TABLA + " WHERE id = ?";
	pool.getConnection(function (err, con) {
		con.query(sql, chart.id, function (err, result) {
			if (callback) {
				if (typeof result !== 'undefined' && result.length > 0)
					callback(new Chart(result[0].id, result[0].tipo));
				else
					callback('ERROR');
			}
		});
		con.release();
    });
};

// Reseteo de charts
DAOChart.prototype.deleteAll = function deleteAll(callback) {
    var sql = "DELETE FROM " + this.NOMBRE_TABLA;
	pool.getConnection(function (err, con) {
		con.query(sql, function (err, result) {
			if (callback) {
				if (err)
					callback('ERROR');
				else
					callback('SUCCESS');
			}
		});
		con.release();
    });
};

// Volcado de charts
DAOChart.prototype.findAll = function findAll(callback) {
    var sql = "SELECT * FROM " + this.NOMBRE_TABLA;
	pool.getConnection(function (err, con) {
		con.query(sql, function (err, result) {
			if (callback) {
				if (typeof result !== 'undefined' && result.length > 0)
					callback(result);
				else
					callback('ERROR');
			}
		});
		con.release();
    });
};

// Creación de datos para test
DAOChart.prototype.initialize = function initialize(callback) {
    var sql = "INSERT IGNORE INTO " + this.NOMBRE_TABLA + " (id, tipo) VALUES (31, 'humedad')";
	pool.getConnection(function (err, con) {
		con.query(sql, function (err, result) {
			if (callback) {
				if (err)
					callback('ERROR');
				callback('SUCCESS');
			}
		});
		con.release();
    });
};

module.exports = DAOChart;