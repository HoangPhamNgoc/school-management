// backend/__tests__/complain-controller.test.js

const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { complainCreate, complainList } = require('../controllers/complain-controller');
const Complain = require('../models/complainSchema.js');

const app = express();
app.use(bodyParser.json());
app.post('/complain', complainCreate);
app.get('/complains/:id', complainList);

jest.mock('../models/complainSchema.js');

describe('Complain Controller', () => {
    describe('complainCreate', () => {
        it('should create a new complain successfully', async () => {
            Complain.prototype.save = jest.fn().mockResolvedValue({ _id: '1', description: 'Test Complain' });

            const response = await request(app).post('/complain').send({ description: 'Test Complain' });

            expect(response.status).toBe(200);
            expect(response.body.description).toBe('Test Complain');
        });
    });
});