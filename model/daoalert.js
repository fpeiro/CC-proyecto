var mysql = require('mysql');

// Constructor de la clase
function DAOAlert(MYSQL_URI, NOMBRE_TABLA) {
    this.MYSQL_URI = MYSQL_URI;
    this.NOMBRE_TABLA = NOMBRE_TABLA;
    pool = mysql.createPool(MYSQL_URI);
    createTable(NOMBRE_TABLA);
}

// Creación de la tabla ALERT
function createTable(NOMBRE_TABLA) {
    var sql = `CREATE TABLE IF NOT EXISTS ` + NOMBRE_TABLA + `(
			id int primary key auto_increment,
			tipo varchar(255) not null,
			dato int not null,
			sensor int not null,
			foreign key(sensor) references charts(id)
		)`;
	pool.getConnection(function (err, con) {
		con.query(sql, function (err, result) {
			if (err)
				throw err;
		});
		con.release();
	});
}

// Inserción de alerts
DAOAlert.prototype.insert = function insert(alert, callback) {
    var sql = "INSERT INTO " + this.NOMBRE_TABLA + " (tipo, dato, sensor) VALUES (?, ?, ?)";
	pool.getConnection(function (err, con) {
		con.query(sql, [alert.tipo, alert.dato, alert.sensor], function (err, result) {
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

// Actualización de alerts
DAOAlert.prototype.update = function update(alert, callback) {
    var sql = "UPDATE " + this.NOMBRE_TABLA + " SET tipo = ?, dato = ?, sensor = ? WHERE id = ?";
	pool.getConnection(function (err, con) {
		con.query(sql, [alert.tipo, alert.dato, alert.sensor, alert.id], function (err, result) {
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

// Eliminación de alerts
DAOAlert.prototype.delete = function del(id, callback) {
    var sql = "DELETE FROM " + this.NOMBRE_TABLA + " WHERE id = ?";
	pool.getConnection(function (err, con) {
		con.query(sql, id, function (err, result) {
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

// Búsqueda de alerts
DAOAlert.prototype.find = function find(sensor, callback) {
    var sql = "SELECT * FROM " + this.NOMBRE_TABLA + " WHERE sensor = ?";
	pool.getConnection(function (err, con) {
		con.query(sql, sensor, function (err, result) {
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

// Reseteo de alerts
DAOAlert.prototype.deleteAll = function deleteAll(callback) {
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

// Creación de datos para test
DAOAlert.prototype.initialize = function initialize(callback) {
    var sql = "INSERT IGNORE INTO " + this.NOMBRE_TABLA + " (id, tipo, dato, sensor) VALUES (21, 'mayor', 45, 31)";
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

module.exports = DAOAlert;