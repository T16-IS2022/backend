const app = require('../index.js');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const annuncio = require('../controllers/annuncio.js');

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

const annuncio_pubblicato = async (app) => {
    const { token } = await login(app);
    const response = await request(app).get('/utente/annunci-pubblicati')
        .set('x-access-token', token);
    if (response.statusCode === 200) {
        return response.body.annunci_pubblicati[0];
    }
    else {
        return null;
    }
}

const pubblica_annuncio = async (app, annuncio) => {
    const { token, id } = await login(app);
    annuncio = annuncio || {
        userId: id,
        foto: 'foto',
        numero_bagni: 1,
        numero_locali: 1,
        locali: [],
        superficie_tot: 1,
        prezzo: 1,
        classe_energetica: 'A',
        indirizzo: 'indirizzo',
        arredato: true,
        durata_vetrina: 1
    }
    const response = await request(app).post('/annuncio')
        .send(annuncio)
        .set('x-access-token', token);
    if (response.statusCode === 201) {
        return { statusCode: response.statusCode, id_annuncio: response.body._id };
    }
    else {
        return { statusCode: response.statusCode };
    }
}

const cancella_annuncio = async (app, id) => {
    const { token } = await login(app);
    const response = await request(app).delete('/annuncio/' + id)
        .set('x-access-token', token);
    if (response.statusCode === 200) {
        return response;
    }
    else {
        return response;
    }
}

const salva_annuncio = async (app, id) => {
    const { token } = await login(app);
    const response = await request(app).get('/annuncio/salva/' + id)
        .set('x-access-token', token);
    return response;
}

const rimuovi_annuncio_salvato = async (app, id) => {
    const { token } = await login(app);
    const response = await request(app).delete('/annuncio/salva/' + id)
        .set('x-access-token', token);
    return response;
}

describe('POST /annuncio/list', () => {
    const route = '/annuncio/list';
    test('POST /annuncio/list con token deve ritornare 200', async () => {
        const { token } = await login(app);
        const response = await request(app).get(route)
        .set('x-access-token', token);
        expect(response.statusCode).toBe(200);
    });
});

describe('GET /annuncio/{id}', () => {
    const route = '/annuncio'
    const id_annuncio = '64764430af70311928f3f1df'
    test('GET /annuncio/{id} con token deve ritornare 200', async () => {
        const { token } = await login(app);
        const response = await request(app).get(route + '/' + id_annuncio)
        .set('x-access-token', token);
        expect(response.statusCode).toBe(200);
    });
    test('GET /annuncio/{id} con token, se l\'annuncio non esiste, deve ritornare 404', async () => {
        const { token } = await login(app);
        const response = await request(app).get(route + '/' + '645eb2096b3c0c57fecb5aa8')
        .set('x-access-token', token);
        expect(response.statusCode).toBe(404);
    });
});

describe('DELETE /annuncio/{id}', () => {
    const route = '/annuncio';

    test('DELETE /annuncio/{id} con token, se l\'id esiste, deve ritornare 200', async () => {
        const pubblica_response = await pubblica_annuncio(app);
        var id = (await annuncio_pubblicato(app))._id;
        const response = await cancella_annuncio(app, id);
        expect(response.statusCode).toBe(200);
    });

    test('DELETE /annuncio/{id} con token, se l\'id non esiste, deve ritornare 404', async () => {
        const { token } = await login(app);
        const response = await cancella_annuncio(app, '647e09dbe10ef749e70fbe1b');
        expect(response.statusCode).toBe(404);
    });
});

describe('PATCH /annuncio/{id}', () => {
    const route = '/annuncio';

    test('PATCH /annuncio/{id} con token, se l\'id esiste, deve ritornare 200', async () => {
        const { token } = await login(app);
        const pubblica_response = await pubblica_annuncio(app);
        const id = (await annuncio_pubblicato(app))._id;
        const response = await request(app).patch(route + '/' + id)
            .send({
                durata_vetrina: 2
            })
            .set('x-access-token', token);
        expect(response.statusCode).toBe(200);
        const delete_response = await cancella_annuncio(app, id);
    });
});

describe('POST /annuncio', () => {
    const route = '/annuncio';
    test('POST /annuncio con con tutti i parametri deve ritornare 200', async () => {
        const response = await pubblica_annuncio(app);
        expect(response.statusCode).toBe(201);
        var annuncio_pubblicato_id = (await annuncio_pubblicato(app))._id;
        const delete_response = await cancella_annuncio(app, annuncio_pubblicato_id);
        expect(delete_response.statusCode).toBe(200);
    });

    test('POST /annuncio con parametri mancanti deve ritornare 400', async () => {
        const response = await pubblica_annuncio(app, {});
        expect(response.statusCode).toBe(400);
    });
});

describe('GET /annuncio/salva/{id}', () => {
    test('GET /annuncio/salva con token, se l\'id esiste, deve ritornare 200', async () => {
        const rimuovi_response = await rimuovi_annuncio_salvato(app, '647ae9ab7e3f6fdb09048cce');
        const response = await salva_annuncio(app, '647ae9ab7e3f6fdb09048cce');
        expect(response.statusCode).toBe(200);
    });
    
    test('GET /annuncio/salva con token, se l\'id non esiste, deve ritornare 404', async () => {
        const rimuovi_response = await rimuovi_annuncio_salvato(app, '647ae9999e3f6fdb09048cce');
        const response = await salva_annuncio(app, '647ae9999e3f6fdb09048cce');
        expect(response.statusCode).toBe(404);
    });

    test('GET /annuncio/salva con token, se l\'id è già salvato, deve ritornare 409', async () => {
        const id = "647ae9ab7e3f6fdb09048cce";
        const rimuovi_response = await rimuovi_annuncio_salvato(app, id);
        const response1 = await salva_annuncio(app, id);
        const response = await salva_annuncio(app, id);
        expect(response.statusCode).toBe(409);
        const rimuovi_response1 = await rimuovi_annuncio_salvato(app, id);
    });
});

describe('DELETE /annuncio/salva/{id}', () => {
    test('DELETE /annuncio/salva con token deve ritornare 200', async () => {
        var id = "647ae9ab7e3f6fdb09048cce"
        const salva_response = await salva_annuncio(app, id);
        const response = await rimuovi_annuncio_salvato(app, '647ae9ab7e3f6fdb09048cce');
        expect(response.statusCode).toBe(200);
    });

});

describe('POST /annuncio/pagamento', () => {
    test('POST /annuncio/pagamento con token, con l\'id dell\'annuncio deve ritornare 200', async () => {
        const { token } = await login(app);
        const pubblica_response = await pubblica_annuncio(app);
        const id = (await annuncio_pubblicato(app))._id;
        const response = await request(app).post('/annuncio/pagamento')
            .send({
                annuncio_id: id
            })
            .set('x-access-token', token);
        expect(response.statusCode).toBe(200);
        const delete_response = await cancella_annuncio(app, id);
    });

    test('POST /annuncio/pagamento con token, senza parametri, deve ritornare 500', async () => {
        const { token } = await login(app);
        const response = await request(app).post('/annuncio/pagamento')
            .set('x-access-token', token);
        expect(response.statusCode).toBe(500);
    });
});