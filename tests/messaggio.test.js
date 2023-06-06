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

describe('POST /messaggio', () => {
    const route = '/messaggio';
    test('POST /messaggio con parametri corretti deve ritornare 200', async () => {
        const id_chat = '63ef95e3a07ce6a51758b845';
        const messaggio = 'Ciao!';
        const {token} = (await login(app));
        const response = await request(app)
            .post(route)
            .send({
                id_chat: id_chat,
                messaggio: messaggio
            })
            .set('x-access-token', token);
        expect(response.statusCode).toBe(200);
    });
    test('POST /messaggio con chat inesistente deve ritornare 404', async () => {
        const token = (await login(app)).token;
        const id_chat = '63ef95e3a07ce6a51758b846';
        const messaggio = 'Ciao!';
        const response = await request(app)
            .post(route)
            .send({
                id_chat: id_chat,
                messaggio: messaggio
            })
            .set('x-access-token', token);
        expect(response.statusCode).toBe(404);
    });
});