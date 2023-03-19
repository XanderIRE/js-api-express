const express = require('express');
const { getTreasures } = require('./controllers/controller.js');
const { postgresErrorHandler, customErrorHandler, internalErrorHandler } = require('./errorHandlers')

const app = express();
app.use(express.json());

// Requests
app.get('/api/treasures', getTreasures);

// Error Handlers
app.use(postgresErrorHandler);
app.use(customErrorHandler);
app.use(internalErrorHandler);

module.exports = app;
