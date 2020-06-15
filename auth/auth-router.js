const bcrypt = require('bcryptjs');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const db = require('../database/dbConfig');
const someSecretTooLazyToPutInEnvFile = 'some super secret';

const validateCredentials = (req, res, next) => {
    const { body } = req;
    const { password, username } = body;
    if (!password || !username)
        return next({
            status: 400,
            message: 'Necessary credentials not sent. try again.',
        });

    next();
};

router.post(
    '/register',
    validateCredentials,
    async ({ body: { username, password } }, res, next) => {
        // implement registration
        // grab username and password
        // hash password
        // save to db
        // create token
        // send token back
        const hash = bcrypt.hashSync(password, 14);
        // save to db
        const user = { username, password: hash };
        try {
            const data = await db('users')
                .insert(user)
                .then(([id]) => {
                    return db('users').where({ id }).first();
                });
            res.status(201).json(data); // probably don't want to send the actual data back but this is a sprint
        } catch (e) {
            next({ status: 500, message: 'server error' });
        }
    },
);

router.post(
    '/login',
    validateCredentials,
    async ({ body: { username, password } }, res, next) => {
        // implement login
        // grab username and password
        // grab user from database with username
        try {
            const dbUser = await db('users').where({ username }).first();

            // compare bcrypt compare password
            const correct = bcrypt.compareSync(password, dbUser.password);

            // if correct password, send token
            if (correct) {
                const token = jwt.sign(
                    {
                        username: dbUser.username,
                    },
                    someSecretTooLazyToPutInEnvFile,
                );
                return res.status(200).json(token);
            }
            next({
                status: 404,
                message: 'Invalid credentials. Please try again.',
            });
            // if not then error
        } catch (e) {
            console.log(e);
            next({ status: 500, message: `server error, ${e}` });
        }
    },
);

router.use((err, req, res, next) => {
    res.status(err.status).json({ message: err.message });
});

module.exports = router;
module.exports.someSecretTooLazyToPutInEnvFile = someSecretTooLazyToPutInEnvFile;
