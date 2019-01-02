var request = require('supertest');
var app = require("./server.js");
var assert = require('assert');

var Pool = require("./model/pool.js");
var Chart = require("./model/chart.js");
var Alert = require("./model/alert.js");

// Página principal
describe("GET /", function () {
    it('devuelve 200 (json)', function (done) {
        request(app)
                .get('/')
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

// Página para buscar alertas
describe("GET /alert", function () {
    it('alert.sensor debe existir en la base de datos', function (done) {
        request(app)
                .get('/alert')
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
                .expect('Content-Type', /json/)
                .expect(200, done);
    });
});

// Página para eliminar alertas
describe("DELETE /alert", function () {
    it('alert.id debe existir en la base de datos', function (done) {
        request(app)
                .delete('/alert')
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
                .expect('Content-Type', /json/)
                .expect(200, done);
    });
});

// Página para eliminar sensores
describe("DELETE /chart", function () {
    it('chart.id debe existir en la base de datos', function (done) {
        request(app)
                .delete('/chart')
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
                .expect('Content-Type', /json/)
                .expect(200, done);
    });
});

// Página para resetear los sensores
describe("DELETE /charts", function () {
    it('devuelve 200 (json)', function (done) {
        request(app)
                .delete('/charts')
                .expect('Content-Type', /json/)
                .expect(200, done);
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
        Pool.daochart.find(new Chart(31, null), function (chart) {
            assert(chart instanceof Chart);
            done();
        });
    });
});

// Función para buscar sensores (fallida)
describe("CALL Pool.daochart.find(...) (fallida)", function () {
    it('chart.id no debe existir en la base de datos', function (done) {
        Pool.daochart.find(new Chart(19991, null), function (status) {
            assert.equal(status, "ERROR");
            done();
        });
    });
});

// Función para modificar sensores
describe("CALL Pool.daochart.update(...)", function () {
    it('chart.id debe existir en la base de datos', function (done) {
        Pool.daochart.update(new Chart(31, 'luminiscencia'), function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Función para modificar sensores (fallida)
describe("CALL Pool.daochart.update(...) (fallida)", function () {
    it('chart.id no debe existir en la base de datos', function (done) {
        Pool.daochart.update(new Chart(19991, 'luminiscencia'), function (status) {
            assert.equal(status, "ERROR");
            done();
        });
    });
});

// Función para añadir sensores
describe("CALL Pool.daochart.insert(...)", function () {
    it('devuelve 200 (SUCCESS)', function (done) {
        Pool.daochart.insert(new Chart(null, 'presion'), function (status) {
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
        Pool.daochart.delete(new Chart(31, null), function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Función para eliminar sensores (fallida)
describe("CALL Pool.daochart.delete(...) (fallida)", function () {
    it('chart.id no debe existir en la base de datos', function (done) {
        Pool.daochart.delete(new Chart(19991, null), function (status) {
            assert.equal(status, "ERROR");
            done();
        });
    });
});

// Función para obtener los sensores
describe("CALL Pool.daochart.findAll(...)", function () {
    it('devuelve un array de charts', function (done) {
        Pool.daochart.findAll(function (charts) {
            assert(typeof charts !== 'undefined' && charts.length > 0);
            done();
        });
    });
});

// Función para resetear los sensores
describe("CALL Pool.daochart.deleteAll(...)", function () {
    it('devuelve 200 (SUCCESS)', function (done) {
        Pool.daochart.deleteAll(function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});