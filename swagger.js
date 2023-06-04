const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css"

function swaggerConfig(app) {
    if(process.env.NODE_ENV != 'deploy') {
        swaggerDocument.host = 'localhost:3000';
        swaggerDocument.schemes = ['http'];
    }
    app.use(
        '/api-docs', 
        express.static(
            'node_modules/swagger-ui-dist/', 
            { index: false }
        ), 
        swaggerUi.serve, 
        swaggerUi.setup(
            swaggerDocument, 
            { customCssUrl: CSS_URL }
        )
    );
}

module.exports = swaggerConfig;