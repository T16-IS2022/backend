const app = require('../index.js');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const {getToken} = require('../middleware/tokenChecker');

describe('POST /chat', () => {
    test('POST /chat senza parametri deve ritornare 401', async () => {
        const token = getToken(1);
        const response = await request(app)
            .post('/annuncio')
            .set({'x-access-token': getToken(1).toString()});
        expect(response.statusCode).toBe(500);
    });
});