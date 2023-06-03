require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

const utente_route = require('./routes/utente'); // import the routes
const annuncio_route = require('./routes/annuncio'); // import the routes
const swaggerConfig = require('./swagger');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors())

swaggerConfig(app);

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

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})

module.exports = app;

