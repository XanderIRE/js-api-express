function postgresErrorHandler(err, req, res, next) {
    if (err.code === "42703" || err.code === "22P02") {
        res.status(400).send({ msg : 'Bad Request' });
    } else {
        next(err);
    }
};

function customErrorHandler(err, req, res, next) {
    if (err.status && err.msg) {
        res.status(err.status).send({msg: err.msg});
    } else {
        next(err);
    }
};

function internalErrorHandler(err, req, res, next) {
    console.log('Internal Server Error: No Action Taken', err)
    res.status(500).send();
};

module.exports = { postgresErrorHandler, customErrorHandler, internalErrorHandler };