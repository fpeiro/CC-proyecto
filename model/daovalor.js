// Constructor de la clase
function DAOValor(poolparam, NOMBRE_TABLA) {
	pool = poolparam;
    this.NOMBRE_TABLA = NOMBRE_TABLA;
    createTable(NOMBRE_TABLA);
}

// Creación de la tabla VALOR
function createTable(NOMBRE_TABLA) {
    var sql = `CREATE TABLE IF NOT EXISTS ` + NOMBRE_TABLA + `(
			id int primary key auto_increment,
			dato int not null,
			sensor int not null,
			foreign key(sensor) references charts(id)
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

// Inserción de valores
DAOValor.prototype.insert = function insert(dato, sensor, callback) {
    var sql = "INSERT INTO " + this.NOMBRE_TABLA + " (dato, sensor) VALUES (?, ?)";
	pool.getConnection(function (err, con) {
		con.query(sql, [dato, sensor], function (err, result) {
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

// Búsqueda de valores
DAOValor.prototype.find = function find(sensor, limite, callback) {
    var sql = "SELECT dato FROM " + this.NOMBRE_TABLA + " WHERE sensor = ? ORDER BY id DESC LIMIT " + limite;
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

// Reseteo de valores
DAOValor.prototype.deleteAll = function deleteAll(callback) {
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
DAOValor.prototype.initialize = function initialize(callback) {
    var sql = "INSERT IGNORE INTO " + this.NOMBRE_TABLA + " (id, dato, sensor) VALUES (21, 50, 31)";
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

module.exports = DAOValor;