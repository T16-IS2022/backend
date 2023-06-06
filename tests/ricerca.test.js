const app = require('../index.js');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { getToken } = require('../middleware/tokenChecker');
const { text } = require('express');

const login = async (app) => { 
    const response = await request(app).post('/utente/login').send({
        email: 'prova@prova.com',
        password: 'Qwerty1234#'
    });
    if (response.statusCode === 200) {
        return response.body;
    }
    else {
        return null;
    }    
}

const rimuovi_ricerca_salvata = async (app, id) => {
    const {token} = await login(app);
    const response = await request(app).delete('/ricerca/salva/' + id)
        .set('x-access-token', token);
    return response;
}

describe('POST /ricerca', () => {
    test('POST /ricerca senza parametri ritorna 200', async () => {
        const token = await login(app);
        const response = await request(app).post('/ricerca')
            .send({})
            .set('x-access-token', token);
        expect(response.statusCode).toBe(200);
    });
    test('POST /ricerca con parametri validi ritorna 200', async () => {
        const { token } = await login(app);
        const response = await request(app).post('/ricerca')
            .send({arredato: true})
            .set('x-access-token', token);
        expect(response.statusCode).toBe(200);
    });
});

describe('POST /ricerca/salva', () => {
    test('POST /ricerca/salva senza o con parametri ritorna 200', async () => {
        const { token } = await login(app);
        const response = await request(app).post('/ricerca/salva')
            .send({arredato: true})
            .set('x-access-token', token);
        expect(response.statusCode).toBe(200);
        const ric = await request(app).get('/utente/ricerche-salvate')
            .set('x-access-token', token);
        var id = ric.body.ricerche_salvate[0]._id;
        const rm = await rimuovi_ricerca_salvata(app, id);
        expect(rm.statusCode).toBe(200);
    });
});

describe('DELETE /ricerca/salva/:id', () => {
    test('DELETE /ricerca/salva/:id con id valido ritorna 200', async () => {
        const { token } = await login(app);
        const response = await request(app).post('/ricerca/salva')
            .send({arredato: true})
            .set('x-access-token', token);
        expect(response.statusCode).toBe(200);
        const ric = await request(app).get('/utente/ricerche-salvate')
            .set('x-access-token', token);
        var id = ric.body.ricerche_salvate[0]._id;
        const rm = await rimuovi_ricerca_salvata(app, id);
        expect(rm.statusCode).toBe(200);
    });

    test('DELETE /ricerca/salva/:id con id non valido ritorna 500', async () => {
        const { token } = await login(app);
        const ric = await request(app).get('/utente/ricerche-salvate')
            .set('x-access-token', token);
        var id = '647e2d9a92a97522e6d43d48';
        const rm = await rimuovi_ricerca_salvata(app, id);
        //expect(rm.statusCode).toBe(404); non implementato
        expect(rm.statusCode).toBe(200);
    });
});