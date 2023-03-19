const { fetchTreasure } = require('../models/model.js');

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
}

module.exports = { getTreasures };
