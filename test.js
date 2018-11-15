var request = require('supertest');
var app = require("./server.js");
var assert = require('assert');

var DAOChart = require("./model/daochart.js");
var Chart = require("./model/chart.js");
var daochart = new DAOChart({
    host: 'us-cdbr-gcp-east-01.cleardb.net',
    user: 'bf513a472fe95b',
    password: '18ecf997',
    database: 'gcp_0ec181dd4858ee89399d'
}, 'charts');

// Inicialización de datos para el test
describe("Inicialización de datos para el test", function () {
    it('', function (done) {
        daochart.initialize(function (status) {
            assert.equal(status, "SUCCESS");
            done();
        });
    });
});

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

// Inicialización de datos para el test
describe("Inicialización de datos para el test", function () {
    it('', function (done) {
        daochart.initialize(function (status) {
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