// backend/__tests__/subject-controller.test.js

const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const {
    subjectCreate,
    freeSubjectList,
    classSubjects,
    getSubjectDetail,
    deleteSubjectsByClass,
    deleteSubjects,
    deleteSubject,
    allSubjects
} = require('../controllers/subject-controller');
const Subject = require('../models/subjectSchema.js');
const Teacher = require('../models/teacherSchema.js');
const Student = require('../models/studentSchema.js');

const app = express();
app.use(bodyParser.json());
app.post('/subject', subjectCreate);
app.get('/subjects/:id', allSubjects);
app.get('/class-subjects/:id', classSubjects);
app.get('/free-subjects/:id', freeSubjectList);
app.get('/subject/:id', getSubjectDetail);
app.delete('/subject/:id', deleteSubject);
app.delete('/subjects/:id', deleteSubjects);
app.delete('/class-subjects/:id', deleteSubjectsByClass);

jest.mock('../models/subjectSchema.js');
jest.mock('../models/teacherSchema.js');
jest.mock('../models/studentSchema.js');

describe('Subject Controller', () => {
    describe('subjectCreate', () => {
        it('should create new subjects successfully', async () => {
            Subject.findOne.mockResolvedValue(null);
            Subject.insertMany.mockResolvedValue([{ subName: 'Math', subCode: 'MATH101' }]);

            const response = await request(app).post('/subject').send({
                subjects: [{ subName: 'Math', subCode: 'MATH101', sessions: 10 }],
                adminID: '1',
                sclassName: 'Class 1'
            });

            expect(response.status).toBe(200);
            expect(response.body[0].subName).toBe('Math');
        });

        it('should return error if subcode already exists', async () => {
            Subject.findOne.mockResolvedValue({ subName: 'Math', subCode: 'MATH101' });

            const response = await request(app).post('/subject').send({
                subjects: [{ subName: 'Math', subCode: 'MATH101', sessions: 10 }],
                adminID: '1',
                sclassName: 'Class 1'
            });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Sorry this subcode must be unique as it already exists');
        });

    });
});