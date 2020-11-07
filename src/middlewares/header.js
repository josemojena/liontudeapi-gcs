const vars = require('../vars');
const errors = require('../errors/unAuthorized');
const { UnAuthorizedError } = require('../errors/unAuthorized');

/**
 * Check local token middleware
 */
function applySecurity(req, res, next) {

    const tokenHeader = req.headers['x-security-token'];
    if (!vars.securtiyTokens || !tokenHeader) {
        next(new errors.UnAuthorizedError());
    }
    else {
        const found = vars.securtiyTokens.filter(t => tokenHeader == t);
        if (!found) {
            next(new errors.UnAuthorizedError());
        }
        else {
            next();
        }
    }
}

/***
 * Capture errors middleware
 */
function applyErrorHandler(err, req, res, next) {

    console.log(err);
    if (err instanceof UnAuthorizedError) {
        res.status(403).send();
    }
    else {

        res.setHeader('Content-Type', 'application/json');
        res.status(500);
        res.send(JSON.stringify(err));
    }
}

module.exports = {
    applyErrorHandler,
    applySecurity
}