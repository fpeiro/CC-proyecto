var mysql = require('mysql');

// Constructor de la clase
function DAOChart(MYSQL_URI, NOMBRE_TABLA) {
    this.MYSQL_URI = MYSQL_URI;
    this.NOMBRE_TABLA = NOMBRE_TABLA;

	this.con = mysql.createConnection(MYSQL_URI);
	handleDisconnect(MYSQL_URI, NOMBRE_TABLA);
}

// Conexión con la base de datos
function handleDisconnect(MYSQL_URI = MYSQL_URI, NOMBRE_TABLA = NOMBRE_TABLA) {
  this.con = mysql.createConnection(MYSQL_URI);

  this.con.connect(function(err) {
    if(err) setTimeout(handleDisconnect(MYSQL_URI, NOMBRE_TABLA), 2000);
	createTable(NOMBRE_TABLA);
  });
  this.con.on('error', function(err) {
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect(MYSQL_URI, NOMBRE_TABLA);
    } else {
      throw err;
    }
  });
}

// Creación de la tabla CHART 
function createTable(NOMBRE_TABLA) {
	var sql = `CREATE TABLE IF NOT EXISTS ` + NOMBRE_TABLA + `(
			id int primary key auto_increment,
			tipo varchar(255) not null
		)`;
	this.con.query(sql, function (err, result) {
		if (err) throw err;
	});
}

// Inserción de charts
DAOChart.prototype.insert = function insert(chart, callback) {
    var sql = "INSERT INTO " + this.NOMBRE_TABLA + " (tipo) VALUES (?)";
    this.con.query(sql, chart.tipo, function (err, result) {
        if (err)
            callback('ERROR');
        callback('SUCCESS');
    });
};

// Actualización de charts
DAOChart.prototype.update = function update(chart, callback) {
    var sql = "UPDATE " + this.NOMBRE_TABLA + " SET tipo = ? WHERE id = ?";
    this.con.query(sql, [chart.tipo, chart.id], function (err, result) {
        if (err)
            callback('ERROR');
        callback('SUCCESS');
    });
};

// Eliminación de charts
DAOChart.prototype.delete = function del(chart, callback) {
    find(chart, function (chart) {
		if (chart === "ERROR") callback('ERROR');
    });
    var sql = "DELETE FROM " + this.NOMBRE_TABLA + " WHERE id = ?";
    return this.con.query(sql, chart.id, function (err, result) {
        if (err)
            callback('ERROR');
        callback('SUCCESS');
    });
};

// Búsqueda de charts
DAOChart.prototype.find = function find(chart, callback) {
    var sql = "SELECT * FROM " + this.NOMBRE_TABLA + " WHERE id = ?";
    this.con.query(sql, chart.id, function (err, result) {
        if (typeof result !== 'undefined' && result.length > 0) callback(result[0]);
		else callback('ERROR');
    });
};

// Reseteo de charts
DAOChart.prototype.deleteAll = function deleteAll(callback) {
    var sql = "DELETE FROM " + this.NOMBRE_TABLA;
    this.con.query(sql, function (err, result) {
        if (err)
            callback('ERROR');
        callback('SUCCESS');
    });
};

// Volcado de charts
DAOChart.prototype.findAll = function findAll(callback) {
    var sql = "SELECT * FROM " + this.NOMBRE_TABLA;
    this.con.query(sql, function (err, result) {
        if (typeof result !== 'undefined') callback(result);
		else callback('ERROR');
    });
};

// Desconexión
DAOChart.prototype.end = function end() {
    this.con.end();
};

module.exports = DAOChart;