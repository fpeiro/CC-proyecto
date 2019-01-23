var request = require('supertest');
var app = require("./server.js");
var assert = require('assert');

var Pool = require("./model/pool.js");
var Chart = require("./model/chart.js");
var Alert = require("./model/alert.js");
var User = require("./model/user.js");

// Usuario de la sesión
app.set('usuario', 'prueba');
var usuario = app.get('usuario');

// Página principal
describe("GET /", function () {
    it('devuelve 200 (json)', function (done) {
        request(app)
                .get('/')
                .expect('Content-Type', /json/)
                .expect(200, done);
    });
});

// Página de estado
describe("GET /status", function () {
    it('devuelve 200 (json)', function (done) {
        request(app)
                .get('/status')
                .expect('Content-Type', /json/)
                .expect(200, done);
    });
});

// Página de información
describe("GET /about", function () {
    it('devuelve 200 (json)', function (done) {
        request(app)
                .get('/about')
                .expect('Content-Type', /json/)
                .expect(200, done);
    });
});

// Inicialización de users para el test
describe("Inicialización de users para el test", function () {
    it('', function (done) {
        Pool.daouser.initialize(function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Inicialización de charts para el test
describe("Inicialización de charts para el test", function () {
    it('', function (done) {
        Pool.daochart.initialize(function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Inicialización de valores para el test
describe("Inicialización de valores para el test", function () {
    it('', function (done) {
        Pool.daovalor.initialize(function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Inicialización de alertas para el test
describe("Inicialización de alerts para el test", function () {
    it('', function (done) {
        Pool.daoalert.initialize(function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Página para modificar usuarios
describe("POST /user", function () {
    it('user.nick debe existir en la base de datos', function (done) {
        request(app)
                .post('/user')
                .send({nick: 'prueba', pass: 'contrasena'})
                .expect('Content-Type', /json/)
                .expect(200, done);
    });
});

// Página para modificar usuarios (fallida)
describe("POST /user (fallida)", function () {
    it('user.nick no debe existir en la base de datos', function (done) {
        request(app)
                .post('/user')
                .send({nick: 'test', pass: 'contrasena'})
                .expect('Content-Type', /json/)
                .expect(404, done);
    });
});

// Página para añadir usuarios
describe("PUT /user", function () {
    it('user.nick no debe existir en la base de datos', function (done) {
        request(app)
                .put('/user')
                .send({nick: 'test', pass: 'contrasena'})
                .expect('Content-Type', /json/)
                .expect(200, done);
    });
});

// Página para añadir usuarios (fallida)
describe("PUT /user (fallida)", function () {
    it('user.nick debe existir en la base de datos', function (done) {
        request(app)
                .put('/user')
                .send({nick: 'test', pass: 'contrasena'})
                .expect('Content-Type', /json/)
                .expect(404, done);
    });
});

// Página para buscar alertas
describe("GET /alert", function () {
    it('alert.sensor debe existir en la base de datos', function (done) {
        request(app)
                .get('/alert')
				.auth('prueba', 'contrasena')
                .query({sensor: 31})
                .expect('Content-Type', /json/)
                .expect(200, done);
    });
});

// Página para buscar alertas (fallida)
describe("GET /alert (fallida)", function () {
    it('alert.sensor no debe existir en la base de datos', function (done) {
        request(app)
                .get('/alert')
				.auth('prueba', 'contrasena')
                .query({sensor: 19991})
                .expect('Content-Type', /json/)
                .expect(404, done);
    });
});

// Página para modificar alertas
describe("POST /alert", function () {
    it('alert.id debe existir en la base de datos', function (done) {
        request(app)
                .post('/alert')
				.auth('prueba', 'contrasena')
                .send({id: 21, dato: 40, sensor: 31, tipo: 'mayor'})
                .expect('Content-Type', /json/)
                .expect(200, done);
    });
});

// Página para modificar alertas (fallida)
describe("POST /alert (fallida)", function () {
    it('alert.id no debe existir en la base de datos', function (done) {
        request(app)
                .post('/alert')
				.auth('prueba', 'contrasena')
                .send({id: 19991, dato: 40, sensor: 31, tipo: 'mayor'})
                .expect('Content-Type', /json/)
                .expect(404, done);
    });
});

// Página para añadir alertas
describe("PUT /alert", function () {
    it('alert.sensor debe existir en la base de datos', function (done) {
        request(app)
                .put('/alert')
				.auth('prueba', 'contrasena')
                .send({dato: 45, sensor: 31, tipo: 'mayor'})
                .expect('Content-Type', /json/)
                .expect(200, done);
    });
});

// Página para añadir alertas (fallida)
describe("PUT /alert (fallida)", function () {
    it('alert.sensor no debe existir en la base de datos', function (done) {
        request(app)
                .put('/alert')
				.auth('prueba', 'contrasena')
                .send({dato: 45, sensor: 19991, tipo: 'mayor'})
                .expect('Content-Type', /json/)
                .expect(404, done);
    });
});

// Página para buscar valores
describe("GET /valor", function () {
    it('valor.sensor debe existir en la base de datos', function (done) {
        request(app)
                .get('/valor')
				.auth('prueba', 'contrasena')
                .query({sensor: 31})
                .expect('Content-Type', /json/)
                .expect(200, done);
    });
});

// Página para buscar valores (fallida)
describe("GET /valor (fallida)", function () {
    it('valor.sensor no debe existir en la base de datos', function (done) {
        request(app)
                .get('/valor')
				.auth('prueba', 'contrasena')
                .query({sensor: 19991})
                .expect('Content-Type', /json/)
                .expect(404, done);
    });
});

// Página para añadir valores
describe("PUT /valor", function () {
    it('valor.sensor debe existir en la base de datos', function (done) {
        request(app)
                .put('/valor')
				.auth('prueba', 'contrasena')
                .send({dato: 50, sensor: 31})
                .expect('Content-Type', /json/)
                .expect(200, done);
    });
});

// Página para añadir valores (fallida)
describe("PUT /valor (fallida)", function () {
    it('valor.sensor no debe existir en la base de datos', function (done) {
        request(app)
                .put('/valor')
				.auth('prueba', 'contrasena')
                .send({dato: 50, sensor: 19991})
                .expect('Content-Type', /json/)
                .expect(404, done);
    });
});

// Página para buscar sensores
describe("GET /chart", function () {
    it('chart.id debe existir en la base de datos', function (done) {
        this.timeout(10000);
        request(app)
                .get('/chart')
				.auth('prueba', 'contrasena')
                .query({id: 31})
                .expect('Content-Type', /json/)
                .expect(200, done);
    });
});

// Página para buscar sensores (fallida)
describe("GET /chart (fallida)", function () {
    it('chart.id no debe existir en la base de datos', function (done) {
        request(app)
                .get('/chart')
				.auth('prueba', 'contrasena')
                .query({id: 19991})
                .expect('Content-Type', /json/)
                .expect(404, done);
    });
});

// Página para buscar gráficas
describe("GET /graph", function () {
    it('chart.id debe existir en la base de datos', function (done) {
        this.timeout(10000);
        request(app)
                .get('/graph')
				.auth('prueba', 'contrasena')
                .query({id: 31})
                .expect('Content-Type', /json/)
                .expect(200, done);
    });
});

// Página para buscar gráficas (fallida)
describe("GET /graph (fallida)", function () {
    it('chart.id no debe existir en la base de datos', function (done) {
        request(app)
                .get('/graph')
				.auth('prueba', 'contrasena')
                .query({id: 19991})
                .expect('Content-Type', /json/)
                .expect(404, done);
    });
});

// Página para modificar sensores
describe("POST /chart", function () {
    it('chart.id debe existir en la base de datos', function (done) {
        request(app)
                .post('/chart')
				.auth('prueba', 'contrasena')
                .send({id: 31, tipo: 'velviento'})
                .expect('Content-Type', /json/)
                .expect(200, done);
    });
});

// Página para modificar sensores (fallida)
describe("POST /chart (fallida)", function () {
    it('chart.id no debe existir en la base de datos', function (done) {
        request(app)
                .post('/chart')
				.auth('prueba', 'contrasena')
                .send({id: 19991, tipo: 'velviento'})
                .expect('Content-Type', /json/)
                .expect(404, done);
    });
});

// Página para añadir sensores
describe("PUT /chart", function () {
    it('devuelve 200 (json)', function (done) {
        request(app)
                .put('/chart')
				.auth('prueba', 'contrasena')
                .send({tipo: 'temperatura'})
                .expect('Content-Type', /json/)
                .expect(200, done);
    });
});

// Página para resetear los valores
describe("DELETE /valores", function () {
    it('devuelve 200 (json)', function (done) {
        request(app)
                .delete('/valores')
				.auth('prueba', 'contrasena')
                .expect('Content-Type', /json/)
                .expect(200, done);
    });
});

// Página para eliminar alertas
describe("DELETE /alert", function () {
    it('alert.id debe existir en la base de datos', function (done) {
        request(app)
                .delete('/alert')
				.auth('prueba', 'contrasena')
                .query({id: 21})
                .expect('Content-Type', /json/)
                .expect(200, done);
    });
});

// Página para eliminar alertas (fallida)
describe("DELETE /alert (fallida)", function () {
    it('alert.id no debe existir en la base de datos', function (done) {
        request(app)
                .delete('/alert')
				.auth('prueba', 'contrasena')
                .query({id: 19991})
                .expect('Content-Type', /json/)
                .expect(404, done);
    });
});

// Página para resetear las alertas
describe("DELETE /alerts", function () {
    it('devuelve 200 (json)', function (done) {
        request(app)
                .delete('/alerts')
				.auth('prueba', 'contrasena')
                .expect('Content-Type', /json/)
                .expect(200, done);
    });
});

// Página para eliminar sensores
describe("DELETE /chart", function () {
    it('chart.id debe existir en la base de datos', function (done) {
        request(app)
                .delete('/chart')
				.auth('prueba', 'contrasena')
                .query({id: 31})
                .expect('Content-Type', /json/)
                .expect(200, done);
    });
});

// Página para eliminar sensores (fallida)
describe("DELETE /chart (fallida)", function () {
    it('chart.id no debe existir en la base de datos', function (done) {
        request(app)
                .delete('/chart')
				.auth('prueba', 'contrasena')
                .query({id: 19991})
                .expect('Content-Type', /json/)
                .expect(404, done);
    });
});

// Página para obtener los sensores
describe("GET /charts", function () {
    it('devuelve 200 (json)', function (done) {
        this.timeout(10000);
        request(app)
                .get('/charts')
				.auth('prueba', 'contrasena')
                .expect('Content-Type', /json/)
                .expect(200, done);
    });
});

// Página para obtener las gráficas
describe("GET /graphs", function () {
    it('devuelve 200 (json)', function (done) {
        this.timeout(10000);
        request(app)
                .get('/graphs')
				.auth('prueba', 'contrasena')
                .expect('Content-Type', /json/)
                .expect(200, done);
    });
});

// Página para resetear los sensores
describe("DELETE /charts", function () {
    it('devuelve 200 (json)', function (done) {
        request(app)
                .delete('/charts')
				.auth('prueba', 'contrasena')
                .expect('Content-Type', /json/)
                .expect(200, done);
    });
});

// Página para eliminar usuarios
describe("DELETE /user", function () {
    it('user.nick debe existir en la base de datos', function (done) {
        request(app)
                .delete('/user')
                .query({nick: 'test'})
                .expect('Content-Type', /json/)
                .expect(200, done);
    });
});

// Página para eliminar usuarios (fallida)
describe("DELETE /user (fallida)", function () {
    it('user.nick no debe existir en la base de datos', function (done) {
        request(app)
                .delete('/user')
                .query({nick: 'test'})
                .expect('Content-Type', /json/)
                .expect(404, done);
    });
});

// Página para resetear los usuarios
describe("DELETE /users", function () {
    it('devuelve 200 (json)', function (done) {
        request(app)
                .delete('/users')
                .expect('Content-Type', /json/)
                .expect(200, done);
    });
});

// Inicialización de users para el test
describe("Inicialización de users para el test", function () {
    it('', function (done) {
        Pool.daouser.initialize(function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Inicialización de charts para el test
describe("Inicialización de charts para el test", function () {
    it('', function (done) {
        Pool.daochart.initialize(function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Inicialización de valores para el test
describe("Inicialización de valores para el test", function () {
    it('', function (done) {
        Pool.daovalor.initialize(function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Inicialización de alertas para el test
describe("Inicialización de alerts para el test", function () {
    it('', function (done) {
        Pool.daoalert.initialize(function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Función para modificar usuarios
describe("CALL Pool.daouser.update(...)", function () {
    it('user.nick debe existir en la base de datos', function (done) {
		Pool.daouser.update(new User('prueba', 'contrasena'), function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Función para modificar usuarios (fallida)
describe("CALL Pool.daouser.update(...) (fallida)", function () {
    it('user.nick no debe existir en la base de datos', function (done) {
		Pool.daouser.update(new User('test', 'contrasena'), function (status) {
            assert.equal(status, "ERROR");
            done();
        });
    });
});

// Función para añadir usuarios
describe("CALL Pool.daouser.insert(...)", function () {
    it('user.nick no debe existir en la base de datos', function (done) {
		Pool.daouser.insert(new User('test', 'contrasena'), function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Función para añadir usuarios (fallida)
describe("CALL Pool.daouser.insert(...) (fallida)", function () {
    it('user.nick debe existir en la base de datos', function (done) {
		Pool.daouser.insert(new User('test', 'contrasena'), function (status) {
            assert.equal(status, "ERROR");
            done();
        });
    });
});

// Función para buscar alertas
describe("CALL Pool.daoalert.find(...)", function () {
    it('alert.sensor debe existir en la base de datos', function (done) {
		Pool.daoalert.find(31, function (alerts) {
            assert(typeof alerts !== 'undefined' && alerts.length > 0);
            done();
        });
    });
});

// Función para buscar alertas (fallida)
describe("CALL Pool.daoalert.find(...) (fallida)", function () {
    it('alert.sensor no debe existir en la base de datos', function (done) {
		Pool.daoalert.find(19991, function (status) {
            assert.equal(status, "ERROR");
            done();
        });
    });
});

// Función para modificar alertas
describe("CALL Pool.daoalert.update(...)", function () {
    it('alert.id debe existir en la base de datos', function (done) {
		Pool.daoalert.update(new Alert(21, 'mayor', 31, 40), function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Función para modificar alertas (fallida)
describe("CALL Pool.daoalert.update(...) (fallida)", function () {
    it('alert.id no debe existir en la base de datos', function (done) {
		Pool.daoalert.update(new Alert(19991, 'mayor', 31, 40), function (status) {
            assert.equal(status, "ERROR");
            done();
        });
    });
});

// Función para añadir alertas
describe("CALL Pool.daoalert.insert(...)", function () {
    it('alert.sensor debe existir en la base de datos', function (done) {
		Pool.daoalert.insert(new Alert(null, 'mayor', 31, 45), function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Función para añadir alertas (fallida)
describe("CALL Pool.daoalert.insert(...) (fallida)", function () {
    it('alert.sensor no debe existir en la base de datos', function (done) {
		Pool.daoalert.insert(new Alert(null, 'mayor', 19991, 45), function (status) {
            assert.equal(status, "ERROR");
            done();
        });
    });
});

// Función para buscar valores
describe("CALL Pool.daovalor.find(...)", function () {
    it('valor.sensor debe existir en la base de datos', function (done) {
        Pool.daovalor.find(31, 100, function (valores) {
            assert(typeof valores !== 'undefined' && valores.length > 0);
            done();
        });
    });
});

// Función para buscar valores (fallida)
describe("CALL Pool.daovalor.find(...) (fallida)", function () {
    it('valor.sensor no debe existir en la base de datos', function (done) {
        Pool.daovalor.find(19991, 1, function (status) {
            assert.equal(status, "ERROR");
            done();
        });
    });
});

// Función para añadir valores
describe("CALL Pool.daovalor.insert(...)", function () {
    it('valor.sensor debe existir en la base de datos', function (done) {
        Pool.daovalor.insert(50, 31, function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Función para añadir valores (fallida)
describe("CALL Pool.daovalor.insert(...) (fallida)", function () {
    it('valor.sensor no debe existir en la base de datos', function (done) {
        Pool.daovalor.insert(50, 19991, function (status) {
            assert.equal(status, "ERROR");
            done();
        });
    });
});

// Función para buscar sensores
describe("CALL Pool.daochart.find(...)", function () {
    it('chart.id debe existir en la base de datos', function (done) {
        Pool.daochart.find(new Chart(31, null, usuario), function (chart) {
            assert(chart instanceof Chart);
            done();
        });
    });
});

// Función para buscar sensores (fallida)
describe("CALL Pool.daochart.find(...) (fallida)", function () {
    it('chart.id no debe existir en la base de datos', function (done) {
        Pool.daochart.find(new Chart(19991, null, usuario), function (status) {
            assert.equal(status, "ERROR");
            done();
        });
    });
});

// Función para modificar sensores
describe("CALL Pool.daochart.update(...)", function () {
    it('chart.id debe existir en la base de datos', function (done) {
        Pool.daochart.update(new Chart(31, 'luminiscencia', usuario), function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Función para modificar sensores (fallida)
describe("CALL Pool.daochart.update(...) (fallida)", function () {
    it('chart.id no debe existir en la base de datos', function (done) {
        Pool.daochart.update(new Chart(19991, 'luminiscencia', usuario), function (status) {
            assert.equal(status, "ERROR");
            done();
        });
    });
});

// Función para añadir sensores
describe("CALL Pool.daochart.insert(...)", function () {
    it('devuelve 200 (SUCCESS)', function (done) {
        Pool.daochart.insert(new Chart(null, 'presion', usuario), function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Función para resetear los valores
describe("CALL Pool.daovalor.deleteAll(...)", function () {
    it('devuelve 200 (SUCCESS)', function (done) {
        Pool.daovalor.deleteAll(function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Función para eliminar alertas
describe("CALL Pool.daoalert.delete(...)", function () {
    it('alert.id debe existir en la base de datos', function (done) {
        Pool.daoalert.delete(21, function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Función para eliminar alertas (fallida)
describe("CALL Pool.daoalert.delete(...) (fallida)", function () {
    it('alert.id no debe existir en la base de datos', function (done) {
        Pool.daoalert.delete(19991, function (status) {
            assert.equal(status, "ERROR");
            done();
        });
    });
});

// Función para resetear las alertas
describe("CALL Pool.daoalert.deleteAll(...)", function () {
    it('devuelve 200 (SUCCESS)', function (done) {
        Pool.daoalert.deleteAll(function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Función para eliminar sensores
describe("CALL Pool.daochart.delete(...)", function () {
    it('chart.id debe existir en la base de datos', function (done) {
        Pool.daochart.delete(new Chart(31, null, usuario), function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Función para eliminar sensores (fallida)
describe("CALL Pool.daochart.delete(...) (fallida)", function () {
    it('chart.id no debe existir en la base de datos', function (done) {
        Pool.daochart.delete(new Chart(19991, null, usuario), function (status) {
            assert.equal(status, "ERROR");
            done();
        });
    });
});

// Función para obtener los sensores
describe("CALL Pool.daochart.findAll(...)", function () {
    it('devuelve un array de charts', function (done) {
        Pool.daochart.findAll(usuario, function (charts) {
            assert(typeof charts !== 'undefined' && charts.length > 0);
            done();
        });
    });
});

// Función para resetear los sensores
describe("CALL Pool.daochart.deleteAll(...)", function () {
    it('devuelve 200 (SUCCESS)', function (done) {
        Pool.daochart.deleteAll(usuario, function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Función para eliminar usuarios
describe("CALL Pool.daouser.delete(...)", function () {
    it('user.nick debe existir en la base de datos', function (done) {
        Pool.daouser.delete(new User('test', null), function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Función para eliminar usuarios (fallida)
describe("CALL Pool.daouser.delete(...) (fallida)", function () {
    it('user.nick no debe existir en la base de datos', function (done) {
        Pool.daouser.delete(new User('test', null), function (status) {
            assert.equal(status, "ERROR");
            done();
        });
    });
});

// Función para resetear las usuarios
describe("CALL Pool.daouser.deleteAll(...)", function () {
    it('devuelve 200 (SUCCESS)', function (done) {
        Pool.daouser.deleteAll(function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});