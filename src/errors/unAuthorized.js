
class UnAuthorizedError extends Error {
    constructor(message) {
        super(message ? message : 'Access denied');
    }
}
module.exports = {
    UnAuthorizedError
}