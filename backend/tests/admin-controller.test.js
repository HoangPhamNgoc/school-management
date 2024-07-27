// backend/__tests__/admin-controller.test.js

const request = require('supertest');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { adminRegister, adminLogIn, getAdminDetail } = require('../controllers/admin-controller');
const Admin = require('../models/adminSchema.js');

app.use(bodyParser.json());
app.post('/register', adminRegister);
app.post('/login', adminLogIn);
app.get('/admin/:id', getAdminDetail);

jest.mock('../models/adminSchema.js');

describe('Admin Controller', () => {
    describe('adminRegister', () => {
        it('should register a new admin successfully', async () => {
            Admin.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
            Admin.prototype.save = jest.fn().mockResolvedValue({ _id: '1', email: 'test@example.com', password: undefined });

            const response = await request(app).post('/register').send({ email: 'test@example.com', schoolName: 'Test School' });

            expect(response.status).toBe(200);
            expect(response.body.email).toBe('test@example.com');
        });

        it('should return error if email already exists', async () => {
            Admin.findOne.mockResolvedValueOnce({ email: 'test@example.com' });

            const response = await request(app).post('/register').send({ email: 'test@example.com', schoolName: 'Test School' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Email already exists');
        });

        it('should return error if school name already exists', async () => {
            Admin.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce({ schoolName: 'Test School' });

            const response = await request(app).post('/register').send({ email: 'test@example.com', schoolName: 'Test School' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('School name already exists');
        });
    });

    describe('adminLogIn', () => {
        it('should log in successfully with correct credentials', async () => {
            Admin.findOne.mockResolvedValue({ email: 'test@example.com', password: 'password' });

            const response = await request(app).post('/login').send({ email: 'test@example.com', password: 'password' });

            expect(response.status).toBe(200);
            expect(response.body.email).toBe('test@example.com');
        });

        it('should return error if email is not found', async () => {
            Admin.findOne.mockResolvedValue(null);

            const response = await request(app).post('/login').send({ email: 'test@example.com', password: 'password' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('User not found');
        });

        it('should return error if password is incorrect', async () => {
            Admin.findOne.mockResolvedValue({ email: 'test@example.com', password: 'password' });

            const response = await request(app).post('/login').send({ email: 'test@example.com', password: 'wrongpassword' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Invalid password');
        });
    });

    describe('getAdminDetail', () => {
        it('should return admin details successfully', async () => {
            Admin.findById.mockResolvedValue({ _id: '1', email: 'test@example.com', password: undefined });

            const response = await request(app).get('/admin/1');

            expect(response.status).toBe(200);
            expect(response.body.email).toBe('test@example.com');
        });

        it('should return error if admin is not found', async () => {
            Admin.findById.mockResolvedValue(null);

            const response = await request(app).get('/admin/1');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('No admin found');
        });
    });
});