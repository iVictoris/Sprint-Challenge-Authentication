const request = require('supertest');
const server = require('../api/server');
const db = require('../database/dbConfig');

const req = () => {
    return request(server);
};

const fetchData = (url, method) => {
    return req()[method](url);
};

beforeEach(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
    await db.seed.run();
});

describe('Register', () => {
    describe('should react accordingly', () => {
        it('with no data', async () => {
            const response = await request(server).post('/api/auth/register');
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(
                'Necessary credentials not sent. try again.',
            );
        });

        it('with data', async () => {
            const response = await request(server)
                .post('/api/auth/register')
                .send({
                    username: 'victor1',
                    password: 'somepassword123',
                });
            expect(response.status).toBe(201);
        });

        it('and gives back a hashed password and id', async () => {
            const response = await request(server)
                .post('/api/auth/register')
                .send({
                    username: 'victor1',
                    password: 'somepassword123',
                });

            expect(response.body.id).toBe(2);
            expect(response.body.password).toMatch(/\$2a\$14\$/);
        });
    });
});

describe('Login', () => {
    describe('should react accordingly', () => {
        it('with no data', async () => {
            const response = await request(server).post('/api/auth/login');
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(
                'Necessary credentials not sent. try again.',
            );
        });

        it('with wrong data', async () => {
            const response = await request(server)
                .post('/api/auth/login')
                .send({
                    username: 'victor',
                    password: 'somepass',
                });
            expect(response.status).toBe(404);
            expect(response.body.message).toBe(
                'Invalid credentials. Please try again.',
            );
        });

        it('and gives back token', async () => {
            const response = await request(server)
                .post('/api/auth/login')
                .send({
                    username: 'victor',
                    password: 'somepassword123',
                });

            expect(response.status).toBe(200);
            expect(response.body).toBeTruthy();
        });
    });
});
