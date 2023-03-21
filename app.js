const express = require('express');
const { getTreasures, postTreasures, patchTreasures, deleteTreasures, getShops } = require('./controllers/controller.js');
const { postgresErrorHandler, customErrorHandler, internalErrorHandler } = require('./errorHandlers')

const app = express();
app.use(express.json());

// Requests
app.get('/api/treasures', getTreasures);
app.post('/api/treasures', postTreasures);
app.patch('/api/treasures/:treasure_id', patchTreasures);
app.delete('/api/treasures/:treasure_id', deleteTreasures);
app.get('/api/shops', getShops);

// Error Handlers
app.use(postgresErrorHandler);
app.use(customErrorHandler);
app.use(internalErrorHandler);


function myMain() {
    app.listen(9550, () => {"listening on port 9550"})
    console.log("listening on Port: 9550")
}

if (require.main === module) myMain();


module.exports = app;
