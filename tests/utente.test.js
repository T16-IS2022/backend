const app = require('../index.js');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { getToken } = require('../middleware/tokenChecker');
const { get } = require('mongoose');
const utente = require('../controllers/utente.js');
//const { request } = require('express');

// simulazione del token
var payload = {
  id: '647c5adeb4c4b59f4c21e4f7'
}

var token = getToken(payload);

var method = '';

describe('POST /utente/registrazione', () => {
  test('POST /utente/registrazione senza parametri deve ritornare 400', async () => {
    const response = await request(app).post('/utente/registrazione');
    expect(response.statusCode).toBe(400);
  });

  test('POST /utente/registrazione con parametri mancanti deve ritornare 400', async () => {
    const response = await request(app).post('/utente/registrazione').send({
      nome: "Mario",
      email: "mariorossi@gmail.com"
    });
    expect(response.statusCode).toBe(400);
  });

  test('POST /utente/registrazione con una email già esistente deve ritornare 409', async () => {
    const response = await request(app).post('/utente/registrazione').send({
      nome: "Mario",
      cognome: "Rossi",
      data_nascita: "2002-05-11T00:00:00.000+00:00",
      numero_tel: "3425569854",
      email: "test@gmail.com",
      password: "Qwerty1234#"
    });
    expect(response.statusCode).toBe(409);
  });

  test('POST /utente/registrazione con parametri corretti deve ritornare 201', async () => {
    const login_response = await request(app).post('/utente/login').send({
      email: "prova@prova.com",
      password: "Qwerty1234#"
    });
    if (login_response.statusCode === 200) {
      var id = login_response.body.id;
      var token = login_response.body.token;
      var delete_response = await request(app).delete('/utente/' + id).set('x-access-token', token);
    }
    const response = await request(app).post('/utente/registrazione').send({
      nome: "Prova",
      cognome: "Prova",
      data_nascita: "2002-05-11T00:00:00.000+00:00",
      numero_tel: "3425569854",
      email: "prova@prova.com",
      password: "Qwerty1234#"
    });
    expect(response.statusCode).toBe(201);
  });
});

describe('PATCH /utente', () => {
  var route = '/utente'
  test('PATCH /utente senza parametri deve ritornare 404', async () => {
    const response = await request(app).patch(route);
    expect(response.statusCode).toBe(404);
  });

  test('PATCH /utente con parametri validi deve ritornare 200', async () => {
    const login_response = await request(app).post('/utente/login').send({
      email: "test@gmail.com",
      password: "Qwerty1234#"
    });

    var id;
    var token;
    if (login_response.statusCode === 200) {
      id = login_response.body.id;
      token = login_response.body.token;
    }

    var req = route + '/' + id;
    const response = await request(app).patch(req)
      .send({
        nome: "Mario",
        cognome: "Rosso",
        data_nascita: "2002-05-11T00:00:00.000+00:00",
        numero_tel: "3425569854",
        email: "test@gmail.com",
        password: "Qwerty1234#"
      })
      .set('x-access-token', token);
    expect(response.statusCode).toBe(200);

    const reset = await request(app).patch(req)
      .send({
        nome: "Mario",
        cognome: "Rosso",
        data_nascita: "2002-05-11T00:00:00.000+00:00",
        numero_tel: "3425569854",
        email: "test@gmail.com",
        password: "Qwerty1234#"
      })
      .set('x-access-token', token);
  });

  test('POST /utente/registrazione con parametri corretti deve ritornare 201', async () => {
    const login_response = await request(app).post('/utente/login').send({
      email: "prova@prova.com",
      password: "Qwerty1234#"
    });
    if (login_response.statusCode === 200) {
      var id = login_response.body.id;
      var token = login_response.body.token;
      var delete_response = await request(app).delete('/utente/' + id).set('x-access-token', token);
    }
    const response = await request(app).post('/utente/registrazione').send({
      nome: "Prova",
      cognome: "Prova",
      data_nascita: "2002-05-11T00:00:00.000+00:00",
      numero_tel: "3425569854",
      email: "prova@prova.com",
      password: "Qwerty1234#"
    });
    expect(response.statusCode).toBe(201);
  });
});

describe('DELETE /utente', () => {
  var route = '/utente'
  test('DELETE /utente senza parametri deve ritornare 404', async () => {
    const response = await request(app).delete(route);
    expect(response.statusCode).toBe(404);
  });

  test('DELETE /utente senza parametri deve ritornare 404', async () => {
    const response = await request(app).delete(route).set('x-access-token', token);
    expect(response.statusCode).toBe(404);
  });

  test('DELETE /utente con parametri validi deve ritornare 200', async () => {
    const login_response = await request(app).post('/utente/login').send({
      email: "test@gmail.com",
      password: "Qwerty1234#"
    });

    var id;
    var token;
    if (login_response.statusCode === 200) {
      id = login_response.body.id;
      token = login_response.body.token;
    }

    var req = route + '/' + id;
    const response = await request(app).delete(req)
      .send({
        nome: "Mario",
        cognome: "Rosso",
        data_nascita: "2002-05-11T00:00:00.000+00:00",
        numero_tel: "3425569854",
        email: "test@gmail.com",
        password: "Qwerty1234#"
      })
      .set('x-access-token', token);
    expect(response.statusCode).toBe(200);

    const reset = await request(app).post('/utente/registrazione')
      .send({
        nome: "Mario",
        cognome: "Rosso",
        data_nascita: "2002-05-11T00:00:00.000+00:00",
        numero_tel: "3425569854",
        email: "test@gmail.com",
        password: "Qwerty1234#"
      })
  });
});

describe('POST /utente/login', () => {

  test('POST /utente/login con parametri mancanti deve ritornare 400', async () => {
    const response = await request(app).post('/utente/login').send({
      email: "mariorossi@gmail.com"
    });
    expect(response.statusCode).toBe(400);
  });

  test('POST /utente/login con parametri email non esistente deve ritornare 404', async () => {
    const response = await request(app).post('/utente/login').send({
      email: "emailnonesistente@gmail.com",
      password: "Qwerty1234#"
    });
    expect(response.statusCode).toBe(404);
  });

  test('POST /utente/login con password errata deve ritornare 401', async () => {
    const response = await request(app).post('/utente/login').send({
      email: "test@gmail.com",
      password: "qwerty1234"
    });
    expect(response.statusCode).toBe(401);
  });

  test('POST /utente/login con parametri corretti deve ritornare 200', async () => {
    const response = await request(app).post('/utente/login').send({
      email: "test@gmail.com",
      password: "Qwerty1234#"
    });
    expect(response.statusCode).toBe(200);
  });

});

describe('GET /utente/logout', () => {
  test('GET /utente/logout deve ritornare 200', async () => {
    const response = await request(app).get('/utente/logout').set('x-access-token', token);
    expect(response.statusCode).toBe(200);
  });
});

describe('GET /utente/annunci-pubblicati', () => {

  test('GET /utente/annunci-pubblicati con utente anonimo deve ritornare 401', async () => {
    const response = (await request(app).get('/utente/annunci-pubblicati').set('x-access-token', 'null'));
    expect(response.statusCode).toBe(401);
  });

  test('GET /utente/annunci-pubblicati con utente inesistente deve ritornare 404', async () => {
    const response = await request(app)
      .get('/utente/annunci-pubblicati')
      .set('x-access-token', token);
    expect(response.statusCode).toBe(404);
  });

  test('GET /utente/annunci-pubblicati con utente loggato deve ritornare 200', async () => {

    const login_response = await request(app).post('/utente/login').send({
      email: "test@gmail.com",
      password: "Qwerty1234#"
    });

    var token;
    if (login_response.statusCode === 200)
      token = login_response.body.token;

    const response = await request(app).get('/utente/annunci-pubblicati').set('x-access-token', token);
    expect(response.statusCode).toBe(200);
  });
});

describe('GET /utente/annunci-salvati', () => {
  var route = '/utente/annunci-salvati'

  test('GET /utente/annunci-salvati con utente anonimo deve ritornare 401', async () => {
    const response = (await request(app)
      .get(route)
      .set('x-access-token', 'null')
    );
    expect(response.statusCode).toBe(401);
  });

  test('GET /utente/annunci-salvati con utente inesistente deve ritornare 404', async () => {
    const response = await request(app)
      .get(route)
      .set('x-access-token', token);
    expect(response.statusCode).toBe(404);
  });

  test('GET /utente/annunci-salvati con utente loggato deve ritornare 200', async () => {

    const login_response = await request(app).post('/utente/login').send({
      email: "test@gmail.com",
      password: "Qwerty1234#"
    });

    var token;
    if (login_response.statusCode === 200)
      token = login_response.body.token;

    const response = await request(app).get(route).set('x-access-token', token);
    expect(response.statusCode).toBe(200);
  });
});

describe('GET /utente/ricerche-salvate', () => {
  var route = '/utente/ricerche-salvate'

  test('GET /utente/ricerche-salvate con utente anonimo deve ritornare 401', async () => {
    const response = (await request(app)
      .get(route)
      .set('x-access-token', '0'));
    expect(response.statusCode).toBe(401);
  });

  test('GET /utente/ricerche-salvate con utente inesistente deve ritornare 404', async () => {
    const response = await request(app)
      .get(route)
      .set('x-access-token', token);
    expect(response.statusCode).toBe(404);
  });

  test('GET /utente/ricerche-salvate con utente loggato deve ritornare 200', async () => {

    const login_response = await request(app)
      .post('/utente/login')
      .send({
        email: "test@gmail.com",
        password: "Qwerty1234#"
      });

    var token;
    if (login_response.statusCode === 200)
      token = login_response.body.token;

    const response = await request(app).get(route).set('x-access-token', token);
    expect(response.statusCode).toBe(200);
  });
});

describe('GET /utente/chat', () => {
  var route = '/utente/chat'

  test('GET /utente/chat con utente anonimo deve ritornare 401', async () => {
    const response = (await request(app)
      .get(route)
      .set('x-access-token', 'null'));
    expect(response.statusCode).toBe(401);
  });

  test('GET /utente/chat con utente inesistente deve ritornare 404', async () => {
    const response = await request(app)
      .get(route)
      .set('x-access-token', token);
    expect(response.statusCode).toBe(404);
  });

  test('GET /utente/chat con utente loggato deve ritornare 200', async () => {

    const login_response = await request(app)
      .post('/utente/login')
      .send({
        email: "test@gmail.com",
        password: "Qwerty1234#"
      });

    var token;
    if (login_response.statusCode === 200)
      token = login_response.body.token;

    const response = await request(app).get(route).set('x-access-token', token);
    expect(response.statusCode).toBe(200);
  });
});

describe('PUT /utente/recupero-password', () => {
  route = '/utente/recupero-password'

  test('PUT /utente/recupero-password deve ritornare 500', async () => {
    const response = (await request(app)
      .put(route));
    expect(response.statusCode).toBe(500);
  });
});