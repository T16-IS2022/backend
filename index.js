require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const db = require('./db.js');

const utente_route = require('./routes/utente'); // import the routes
const annuncio_route = require('./routes/annuncio'); // import the routes
const ricerca_route = require('./routes/ricerca'); // import the routes
const messaggio_route = require('./routes/messaggio'); // import the routes
const chat_route = require('./routes/chat'); // import the routes
const swaggerConfig = require('./swagger');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors())

swaggerConfig(app);

app.use('/', utente_route); //to use the routes
app.use('/', annuncio_route); //to use the routes
app.use('/', ricerca_route); //to use the routes
app.use('/', messaggio_route); //to use the routes
app.use('/', chat_route); //to use the routes

/* Default 404 handler */
app.use((req, res,) => {
    res.status(404);
    res.json({ error: 'Error 404: Not Found' });
});

db.connect();

var port;
if(process.env.NODE_ENV !== 'test') {
    port = process.env.PORT || 3000;
}
else {
    port = 0;
}

const listener = app.listen(port, () => 
    console.log('Your app is listening on port ' + listener.address().port)  
)

module.exports = app;

