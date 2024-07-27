// backend/__tests__/class-controller.test.js

const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { sclassCreate, sclassList, getSclassDetail, getSclassStudents, deleteSclass, deleteSclasses } = require('../controllers/class-controller');
const Sclass = require('../models/sclassSchema.js');
const Student = require('../models/studentSchema.js');
const Subject = require('../models/subjectSchema.js');
const Teacher = require('../models/teacherSchema.js');

const app = express();
app.use(bodyParser.json());
app.post('/sclass', sclassCreate);
app.get('/sclasses/:id', sclassList);
app.get('/sclass/:id', getSclassDetail);
app.get('/sclass/:id/students', getSclassStudents);
app.delete('/sclass/:id', deleteSclass);
app.delete('/sclasses/:id', deleteSclasses);

jest.mock('../models/sclassSchema.js');
jest.mock('../models/studentSchema.js');
jest.mock('../models/subjectSchema.js');
jest.mock('../models/teacherSchema.js');

describe('Class Controller', () => {
    describe('sclassCreate', () => {
        it('should create a new class successfully', async () => {
            Sclass.findOne.mockResolvedValueOnce(null);
            Sclass.prototype.save = jest.fn().mockResolvedValue({ _id: '1', sclassName: 'Class 1', school: '1' });

            const response = await request(app).post('/sclass').send({ sclassName: 'Class 1', adminID: '1' });

            expect(response.status).toBe(200);
            expect(response.body.sclassName).toBe('Class 1');
        });

        it('should return error if class name already exists', async () => {
            Sclass.findOne.mockResolvedValueOnce({ sclassName: 'Class 1' });

            const response = await request(app).post('/sclass').send({ sclassName: 'Class 1', adminID: '1' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Sorry this class name already exists');
        });
    });

    describe('sclassList', () => {
        it('should return list of classes successfully', async () => {
            Sclass.find.mockResolvedValue([{ _id: '1', sclassName: 'Class 1', school: '1' }]);

            const response = await request(app).get('/sclasses/1');

            expect(response.status).toBe(200);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('should return message if no classes found', async () => {
            Sclass.find.mockResolvedValue([]);

            const response = await request(app).get('/sclasses/1');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('No sclasses found');
        });
    });

    describe('getSclassDetail', () => {

        it('should return message if class not found', async () => {
            Sclass.findById.mockResolvedValue(null);

            const response = await request(app).get('/sclass/1');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('No class found');
        });
    });

    describe('getSclassStudents', () => {
        it('should return list of students successfully', async () => {
            Student.find.mockResolvedValue([{ _id: '1', name: 'Student 1', sclassName: '1' }]);

            const response = await request(app).get('/sclass/1/students');

            expect(response.status).toBe(200);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('should return message if no students found', async () => {
            Student.find.mockResolvedValue([]);

            const response = await request(app).get('/sclass/1/students');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('No students found');
        });
    });

    describe('deleteSclass', () => {
        it('should delete class successfully', async () => {
            Sclass.findByIdAndDelete.mockResolvedValue({ _id: '1', sclassName: 'Class 1' });
            Student.deleteMany.mockResolvedValue({ deletedCount: 1 });
            Subject.deleteMany.mockResolvedValue({ deletedCount: 1 });
            Teacher.deleteMany.mockResolvedValue({ deletedCount: 1 });

            const response = await request(app).delete('/sclass/1');

            expect(response.status).toBe(200);
            expect(response.body.sclassName).toBe('Class 1');
        });

        it('should return message if class not found', async () => {
            Sclass.findByIdAndDelete.mockResolvedValue(null);

            const response = await request(app).delete('/sclass/1');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Class not found');
        });
    });

    describe('deleteSclasses', () => {
        it('should delete all classes successfully', async () => {
            Sclass.deleteMany.mockResolvedValue({ deletedCount: 1 });
            Student.deleteMany.mockResolvedValue({ deletedCount: 1 });
            Subject.deleteMany.mockResolvedValue({ deletedCount: 1 });
            Teacher.deleteMany.mockResolvedValue({ deletedCount: 1 });

            const response = await request(app).delete('/sclasses/1');

            expect(response.status).toBe(200);
            expect(response.body.deletedCount).toBe(1);
        });

        it('should return message if no classes found to delete', async () => {
            Sclass.deleteMany.mockResolvedValue({ deletedCount: 0 });

            const response = await request(app).delete('/sclasses/1');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('No classes found to delete');
        });
    });
});