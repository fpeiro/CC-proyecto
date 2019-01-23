var Chart = require("./chart.js");

// Constructor de la clase
function DAOChart(poolparam, NOMBRE_TABLA) {
	pool = poolparam;
    this.NOMBRE_TABLA = NOMBRE_TABLA;
    createTable(NOMBRE_TABLA);
}

// Creación de la tabla CHART
function createTable(NOMBRE_TABLA) {
    var sql = `CREATE TABLE IF NOT EXISTS ` + NOMBRE_TABLA + `(
			id int primary key auto_increment,
			tipo varchar(255) not null,
			dueno varchar(255) not null,
			foreign key(dueno) references users(nick)
		)`;
	pool.getConnection(function (err, con) {
		if (err)
			throw err;
		con.query(sql, function (err, result) {
			if (err)
				throw err;
		});
		con.release();
    });
}

// Inserción de charts
DAOChart.prototype.insert = function insert(chart, callback) {
    var sql = "INSERT INTO " + this.NOMBRE_TABLA + " (tipo, dueno) VALUES (?, ?)";
	pool.getConnection(function (err, con) {
		con.query(sql, [chart.tipo, chart.dueno], function (err, result) {
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
    var sql = "UPDATE " + this.NOMBRE_TABLA + " SET tipo = ? WHERE id = ? AND dueno = ?";
	pool.getConnection(function (err, con) {
		con.query(sql, [chart.tipo, chart.id, chart.dueno], function (err, result) {
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
    var sql = "DELETE FROM " + this.NOMBRE_TABLA + " WHERE id = ? AND dueno = ?";
	pool.getConnection(function (err, con) {
		con.query(sql, [chart.id, chart.dueno], function (err, result) {
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
    var sql = "SELECT * FROM " + this.NOMBRE_TABLA + " WHERE id = ? AND dueno = ?";
	pool.getConnection(function (err, con) {
		con.query(sql, [chart.id, chart.dueno], function (err, result) {
			if (callback) {
				if (typeof result !== 'undefined' && result.length > 0)
					callback(new Chart(result[0].id, result[0].tipo, result[0].dueno));
				else
					callback('ERROR');
			}
		});
		con.release();
    });
};

// Reseteo de charts
DAOChart.prototype.deleteAll = function deleteAll(dueno, callback) {
    var sql = "DELETE FROM " + this.NOMBRE_TABLA + " WHERE dueno = ?";
	pool.getConnection(function (err, con) {
		con.query(sql, dueno, function (err, result) {
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
DAOChart.prototype.findAll = function findAll(dueno, callback) {
    var sql = "SELECT * FROM " + this.NOMBRE_TABLA + " WHERE dueno = ?";
	pool.getConnection(function (err, con) {
		con.query(sql, dueno, function (err, result) {
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
    var sql = "INSERT IGNORE INTO " + this.NOMBRE_TABLA + " (id, tipo, dueno) VALUES (31, 'humedad', 'prueba')";
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