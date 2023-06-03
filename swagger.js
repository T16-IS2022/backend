const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css"

function swaggerConfig(app) {
    app.use('/api-docs', express.static('node_modules/swagger-ui-dist/', { index: false }), swaggerUi.serve, swaggerUi.setup(swaggerDocument, { customCss: CSS_URL }));
}

module.exports = swaggerConfig;