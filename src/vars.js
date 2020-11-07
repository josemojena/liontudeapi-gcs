
//store local tokens on env variable
const securtiyTokens = (process.env.AUTHORIZED_KEYS) ? process.env.AUTHORIZED_KEYS.split(';') : [];
const unAuthorizedError = 'access_denied';

module.exports = {
   securtiyTokens,
   unAuthorizedError
}