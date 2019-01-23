var User = require("./user.js");
const bcrypt = require('bcryptjs');

// Constructor de la clase
function DAOUser(poolparam, NOMBRE_TABLA) {
	pool = poolparam;
    this.NOMBRE_TABLA = NOMBRE_TABLA;
    createTable(NOMBRE_TABLA);
}

// Creación de la tabla USER
function createTable(NOMBRE_TABLA) {
    var sql = `CREATE TABLE IF NOT EXISTS ` + NOMBRE_TABLA + `(
			nick varchar(255) primary key,
			pass varchar(255) not null
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

// Inserción de users
DAOUser.prototype.insert = function insert(user, callback) {
    var sql = "INSERT INTO " + this.NOMBRE_TABLA + " (nick, pass) VALUES (?, ?)";
	pool.getConnection(function (err, con) {
		hash(user.pass, function(encrpass) {
			con.query(sql, [user.nick, encrpass], function (err, result) {
				if (callback) {
					if (err)
						callback('ERROR');
					else
						callback('SUCCESS');
				}
			});
			con.release();
		});
    });
};

// Actualización de users
DAOUser.prototype.update = function update(user, callback) {
    var sql = "UPDATE " + this.NOMBRE_TABLA + " SET pass = ? WHERE nick = ?";
	pool.getConnection(function (err, con) {
		hash(user.pass, function(encrpass) {
			con.query(sql, [encrpass, user.nick], function (err, result) {
				if (callback) {
					if (err || result.affectedRows === 0)
						callback('ERROR');
					else
						callback('SUCCESS');
				}
			});
			con.release();
		});
    });
};

// Eliminación de users
DAOUser.prototype.delete = function del(user, callback) {
    var sql = "DELETE FROM " + this.NOMBRE_TABLA + " WHERE nick = ?";
	pool.getConnection(function (err, con) {
		con.query(sql, user.nick, function (err, result) {
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

// Búsqueda de users
DAOUser.prototype.find = function find(user, callback) {
    var sql = "SELECT * FROM " + this.NOMBRE_TABLA + " WHERE nick = ?";
	pool.getConnection(function (err, con) {
		con.query(sql, user.nick, function (err, result) {
			if (callback) {
				if (typeof result !== 'undefined' && result.length > 0) {
					bcrypt.compare(user.pass, result[0].pass, function (err, result) {
						if (result == true)
							callback('SUCCESS');
						else
							callback('ERROR');
					});
				}
				else
					callback('ERROR');
			}
		});
		con.release();
    });
};

// Reseteo de users
DAOUser.prototype.deleteAll = function deleteAll(callback) {
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
DAOUser.prototype.initialize = function initialize(callback) {
	var NOMBRE_TABLA = this.NOMBRE_TABLA;
	hash('abc123', function(encrpass) {
		var sql = "INSERT IGNORE INTO " + NOMBRE_TABLA + " (nick, pass) VALUES ('prueba', '" + encrpass + "')";
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
    });
};

// Función para encriptar la contraseña
function hash(pass, callback) {
	bcrypt.hash(pass, 10, function (err, hash){
		if (err) {
			callback(pass);
		}
		callback(hash);
	})
}

module.exports = DAOUser;