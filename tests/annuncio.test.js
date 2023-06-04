const app = require('../index.js');
const request = require('supertest');
const jwt = require('jsonwebtoken');

describe('POST /annuncio', () => {
    test('POST /annuncio senza parametri deve ritornare 400', async () => {
        const response = await request(app).post('/annuncio');
        expect(response.statusCode).toBe(400);
    });
});