const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

function swaggerConfig(app) {
    app.use('/api-docs', express.static('node_modules/swagger-ui-dist/', {index: false}), swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

module.exports = swaggerConfig;