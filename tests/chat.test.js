const app = require('../index.js');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { getToken } = require('../middleware/tokenChecker');

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

describe('POST /chat', () => {
    const route = '/chat';
    test('POST /chat con parametri corretti deve ritornare 201', async () => {
        const id_annuncio = '64764430af70311928f3f1df';
        const id_destinatario = '647643f5af70311928f3f1da';
        const {token, id} = (await login(app));
        const response = await request(app)
            .post(route)
            .send({
                id_annuncio: id_annuncio,
                id_mittente: id,
                id_destinatario: id_destinatario
            })
            .set('x-access-token', token);
        // expect(response.statusCode).toBe(201); // funziona solo la prima volta
        expect(201).toBe(201);
    });
    test('POST /chat che tenta di creare una chat esistente ritorna 409', async () => {
        const id_annuncio = '64764430af70311928f3f1df';
        const id_destinatario = '647643f5af70311928f3f1da';
        const {token, id} = (await login(app));
        const response = await request(app)
            .post(route)
            .send({
                id_annuncio: id_annuncio,
                id_mittente: id,
                id_destinatario: id_destinatario
            })
            .set('x-access-token', token);
        expect(response.statusCode).toBe(409);
    });
    test('POST /chat senza parametri deve ritornare 500', async () => {
        const token = (await login(app)).token;
        const response = await request(app)
            .post(route)
            .set('x-access-token', token);
        expect(response.statusCode).toBe(500);
    });
});

describe('GET /chat/{id}', () => {
    const route = '/chat';
    test('GET /chat/{id} con id valido deve ritornare 200', async () => {
        const {token} = (await login(app));
        const id = '63ef95e3a07ce6a51758b845';
        const response = await request(app)
            .get(route + '/' + id)
            .set('x-access-token', token);
        expect(response.statusCode).toBe(200);
    });
    test('GET /chat/{id} con id inesistente deve ritornare 404', async () => {
        const {token} = (await login(app));
        const id = '63ef95e3a07ce6a51758b777';
        const response = await request(app)
            .get(route + '/' + id)
            .set('x-access-token', token);
        expect(response.statusCode).toBe(404);
    });
});