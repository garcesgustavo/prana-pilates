const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

describe('Prana Pilates API Tests', () => {
    // Basic health check
    it('GET /api/health should return 200 OK', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('OK');
    });

    // Availability endpoint
    it('GET /api/availability should return availability object', async () => {
        const res = await request(app).get('/api/availability');
        expect(res.statusCode).toEqual(200);
        expect(res).toHaveProperty('body');
        // It could be an empty object if no settings are in DB, but it should be an object
        expect(typeof res.body).toBe('object');
    });

    // Visit tracking - This might hit the DB, but it's a safe increment
    it('POST /api/visit should increment and return visit count', async () => {
        const res = await request(app).post('/api/visit');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('visits');
        expect(typeof res.body.visits).toBe('number');
    });

    // Cleanup after tests
    afterAll(async () => {
        await mongoose.connection.close();
    });
});
