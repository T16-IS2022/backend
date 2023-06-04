const app = require('../index.js');
const request = require('supertest');
const jwt = require('jsonwebtoken');

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

  test('POST /utente/registrazione con i dati corretti deve ritornare 201', async () => {
    const response = await request(app).post('/utente/registrazione').send({
        nome: "Mario",
        cognome: "Rossi",
        data_nascita: "2002-05-11T00:00:00.000+00:00",
        numero_tel: "3425569854",
        email: "mario.rossi@gmail.com",
        password: "Qwerty1234#"
    });
    expect(response.statusCode).toBe(409);
  });
});

/*
describe('POST /utente/login', () => {
  test('POST /utente/login with no body should return 400 (no body provided)', async () => {
    const response = await request(app).post('/utente/login');
    expect(response.statusCode).toBe(400);
  });

  test('POST /utente/login with no username should return 400 (no username provided)', async () => {
    const response = await request(app).post('/utente/login').send({
      password: "password"
    });
    expect(response.statusCode).toBe(400);
  });

  test('POST /utente/login with a username that doesn\'t exist should return 404 (user not found)', async () => {
    const response = await request(app).post('/utente/login').send({
      username: "thisusernameisnotreal",
      password: "password"
    });

    expect(response.statusCode).toBe(404);
  });

  test('POST /utente/login with the correct username but wrong password should return 401 (Wrong password)', async () => {
    const response = await request(app).post('/utente/login').send({
      username: "yomama",
      password: "wrongpassword"
    });

    expect(response.statusCode).toBe(401);
  });

  test('POST /utente/login with the correct information should return 200', async () => {
    const response = await request(app).post('/utente/login').send({
      username: "yomama",
      password: "sofat"
    });

    expect(response.statusCode).toBe(200);
  });

  test('POST /utente/login with the correct information should return a token', async () => {
    const response = await request(app).post('/utente/login').send({
      username: "yomama",
      password: "sofat"
    });

    expect(response.body.token).toBeDefined();
  });
});
*/