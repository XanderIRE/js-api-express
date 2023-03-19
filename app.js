const express = require('express');
const { getTreasures, postTreasures } = require('./controllers/controller.js');
const { postgresErrorHandler, customErrorHandler, internalErrorHandler } = require('./errorHandlers')

const app = express();
app.use(express.json());

// Requests
app.get('/api/treasures', getTreasures);
app.post('/api/treasures', postTreasures);

// Error Handlers
app.use(postgresErrorHandler);
app.use(customErrorHandler);
app.use(internalErrorHandler);

module.exports = app;
