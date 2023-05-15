require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const app = express();
const cors = require('cors');
const swaggerDocument = require('./swagger.json');
const path = require('path');

const utente_route = require('./routes/utente'); // import the routes
const annuncio_route = require('./routes/annuncio'); // import the routes

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api-docs', express.static('node_modules/swagger-ui-dist/', {index: false}), swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(cors())

app.use('/', utente_route); //to use the routes
app.use('/', annuncio_route); //to use the routes

/* Default 404 handler */
app.use((req, res,) => {
    res.status(404);
    res.json({ error: 'Error 404: Not Found' });
});

mongoose.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if (err) return console.log("Error: ", err);
        console.log("MongoDB Connection -- Ready state is:", mongoose.connection.readyState);
    }
);

if (process.env.TESTING == 'true') {
    console.log("TESTING MODE");
} else {
    const listener = app.listen(process.env.PORT || 3000, () => {
        console.log('Your app is listening on port ' + listener.address().port)
    })
}

module.exports = app;

