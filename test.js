var request = require('supertest');
var app = require("./server.js");
var assert = require('assert');

var MYSQL_URI = {
    host: 'us-cdbr-gcp-east-01.cleardb.net',
    user: 'bf513a472fe95b',
    password: '18ecf997',
    database: 'gcp_0ec181dd4858ee89399d'
};

var DAOChart = require("./model/daochart.js");
var DAOValor = require("./model/daovalor.js");
var Chart = require("./model/chart.js");
var daochart = new DAOChart(MYSQL_URI, 'charts');
var daovalor = new DAOValor(MYSQL_URI, 'valores');

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
        daochart.initialize(function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Inicialización de valores para el test
describe("Inicialización de valores para el test", function () {
    it('', function (done) {
        daovalor.initialize(function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Página para buscar valores
describe("GET /valor", function () {
    it('valor.sensor debe existir en la base de datos', function (done) {
        this.timeout(10000);
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
        this.timeout(10000);
        request(app)
                .get('/valor')
                .query({sensor: 19991})
                .expect('Content-Type', /json/)
                .expect(404, done);
    });
});

// Página para añadir valores
describe("PUT /valor", function () {
    it('devuelve 200 (json)', function (done) {
        request(app)
                .put('/valor')
                .send({dato: 50, sensor: 31})
                .expect('Content-Type', /json/)
                .expect(200, done);
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
        this.timeout(10000);
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
        this.timeout(10000);
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
        daochart.initialize(function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Inicialización de valores para el test
describe("Inicialización de valores para el test", function () {
    it('', function (done) {
        daovalor.initialize(function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Función para buscar valores
describe("CALL daovalor.find(...)", function () {
    it('valor.sensor debe existir en la base de datos', function (done) {
        daovalor.find(31, 100, function (valores) {
            assert(typeof valores !== 'undefined' && valores.length > 0);
            done();
        });
    });
});

// Función para buscar valores (fallida)
describe("CALL daovalor.find(...) (fallida)", function () {
    it('valor.sensor no debe existir en la base de datos', function (done) {
        daovalor.find(19991, 1, function (status) {
            assert.equal(status, "ERROR");
            done();
        });
    });
});

// Función para añadir valores
describe("CALL daovalor.insert(...)", function () {
    it('devuelve 200 (SUCCESS)', function (done) {
        daovalor.insert(50, 31, function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Función para buscar sensores
describe("CALL daochart.find(...)", function () {
    it('chart.id debe existir en la base de datos', function (done) {
        daochart.find(new Chart(31, null), function (chart) {
            assert(chart instanceof Chart);
            done();
        });
    });
});

// Función para buscar sensores (fallida)
describe("CALL daochart.find(...) (fallida)", function () {
    it('chart.id no debe existir en la base de datos', function (done) {
        daochart.find(new Chart(19991, null), function (status) {
            assert.equal(status, "ERROR");
            done();
        });
    });
});

// Función para modificar sensores
describe("CALL daochart.update(...)", function () {
    it('chart.id debe existir en la base de datos', function (done) {
        daochart.update(new Chart(31, 'luminiscencia'), function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Función para modificar sensores (fallida)
describe("CALL daochart.update(...) (fallida)", function () {
    it('chart.id no debe existir en la base de datos', function (done) {
        daochart.update(new Chart(19991, 'luminiscencia'), function (status) {
            assert.equal(status, "ERROR");
            done();
        });
    });
});

// Función para añadir sensores
describe("CALL daochart.insert(...)", function () {
    it('devuelve 200 (SUCCESS)', function (done) {
        daochart.insert(new Chart(null, 'presion'), function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Función para resetear los valores
describe("CALL daovalor.deleteAll(...)", function () {
    it('devuelve 200 (SUCCESS)', function (done) {
        daovalor.deleteAll(function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Función para eliminar sensores
describe("CALL daochart.delete(...)", function () {
    it('chart.id debe existir en la base de datos', function (done) {
        daochart.delete(new Chart(31, null), function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

// Función para eliminar sensores (fallida)
describe("CALL daochart.delete(...) (fallida)", function () {
    it('chart.id no debe existir en la base de datos', function (done) {
        daochart.delete(new Chart(19991, null), function (status) {
            assert.equal(status, "ERROR");
            done();
        });
    });
});

// Función para obtener los sensores
describe("CALL daochart.findAll(...)", function () {
    it('devuelve un array de charts', function (done) {
        daochart.findAll(function (charts) {
            assert(typeof charts !== 'undefined' && charts.length > 0);
            done();
        });
    });
});

// Función para resetear los sensores
describe("CALL daochart.deleteAll(...)", function () {
    it('devuelve 200 (SUCCESS)', function (done) {
        daochart.deleteAll(function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});