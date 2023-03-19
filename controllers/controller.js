const { fetchTreasure, addTreasure, updateTreasure, removeTreasure } = require('../models/model.js');

const getTreasures = (req, res, next) => {
    return fetchTreasure(
        req.query.sortOn,
        req.query.order,
        req.query.colour,
        req.query.max_age,
        req.query.min_age
    )
    .then((treasures) => {
        res.status(200).send(treasures);
    })
    .catch((err) => {
        next(err);
    })
};

const postTreasures = (req, res, next) => {
    return addTreasure(req.body)
    .then((addedTreasure) => {
        res.status(201).send(addedTreasure);
    })
    .catch((err) => {
        next(err);
    })
};

const patchTreasures = (req, res, next) => {
    return updateTreasure(req.params, req.body)
    .then((updatedTreasure) => {
        res.status(201).send(updatedTreasure);
    })
    .catch((err) => {
        next(err);
    })
};

const deleteTreasures = (req, res, next) => {
    return removeTreasure(req.params)
    .then(() => {
        res.status(204).send();
    })
    .catch((err) => {
        next(err);
    })
};

module.exports = { getTreasures, postTreasures, patchTreasures, deleteTreasures };
