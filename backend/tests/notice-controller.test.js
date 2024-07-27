// backend/__tests__/notice-controller.test.js

const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { noticeCreate, noticeList, updateNotice, deleteNotice, deleteNotices } = require('../controllers/notice-controller');
const Notice = require('../models/noticeSchema.js');

const app = express();
app.use(bodyParser.json());
app.post('/notice', noticeCreate);
app.get('/notices/:id', noticeList);
app.put('/notice/:id', updateNotice);
app.delete('/notice/:id', deleteNotice);
app.delete('/notices/:id', deleteNotices);

jest.mock('../models/noticeSchema.js');

describe('Notice Controller', () => {
    describe('noticeCreate', () => {
        it('should create a new notice successfully', async () => {
            Notice.prototype.save = jest.fn().mockResolvedValue({ _id: '1', title: 'Test Notice' });

            const response = await request(app).post('/notice').send({ title: 'Test Notice', adminID: '1' });

            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Test Notice');
        });

    });

    describe('noticeList', () => {
        it('should return list of notices successfully', async () => {
            Notice.find.mockResolvedValue([{ _id: '1', title: 'Test Notice' }]);

            const response = await request(app).get('/notices/1');

            expect(response.status).toBe(200);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('should return message if no notices found', async () => {
            Notice.find.mockResolvedValue([]);

            const response = await request(app).get('/notices/1');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('No notices found');
        });
    });

    describe('updateNotice', () => {
        it('should update notice successfully', async () => {
            Notice.findByIdAndUpdate.mockResolvedValue({ _id: '1', title: 'Updated Notice' });

            const response = await request(app).put('/notice/1').send({ title: 'Updated Notice' });

            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Updated Notice');
        });
    });

    describe('deleteNotice', () => {
        it('should delete notice successfully', async () => {
            Notice.findByIdAndDelete.mockResolvedValue({ _id: '1', title: 'Deleted Notice' });

            const response = await request(app).delete('/notice/1');

            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Deleted Notice');
        });
    });

    describe('deleteNotices', () => {
        it('should delete all notices successfully', async () => {
            Notice.deleteMany.mockResolvedValue({ deletedCount: 1 });

            const response = await request(app).delete('/notices/1');

            expect(response.status).toBe(200);
            expect(response.body.deletedCount).toBe(1);
        });

        it('should return message if no notices found to delete', async () => {
            Notice.deleteMany.mockResolvedValue({ deletedCount: 0 });

            const response = await request(app).delete('/notices/1');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('No notices found to delete');
        });
    });
});