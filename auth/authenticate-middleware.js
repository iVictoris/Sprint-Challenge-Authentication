/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/
const jwt = require('jsonwebtoken');
const { someSecretTooLazyToPutInEnvFile } = require('./auth-router');

module.exports = (req, res, next) => {
    // check for token in authorization header
    const { headers } = req; // headers should have authorization which should be token
    const { authorization } = headers;

    // verify token
    jwt.verify(authorization, someSecretTooLazyToPutInEnvFile, (err, _) => {
        if (err) {
            res.status(401).json({ you: 'shall not pass!' });
        }

        // otherwise decoded is verified token
        // and we can send it on it's way
        next();
    });
};
