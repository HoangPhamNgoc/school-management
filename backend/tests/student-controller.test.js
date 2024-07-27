// backend/__tests__/student-controller.test.js

const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const {
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudents,
    deleteStudent,
    updateStudent,
    studentAttendance,
    deleteStudentsByClass,
    updateExamResult,
    clearAllStudentsAttendanceBySubject,
    clearAllStudentsAttendance,
    removeStudentAttendanceBySubject,
    removeStudentAttendance,
} = require('../controllers/student_controller');
const Student = require('../models/studentSchema.js');
const Subject = require('../models/subjectSchema.js');

const app = express();
app.use(bodyParser.json());
app.post('/student/register', studentRegister);
app.post('/student/login', studentLogIn);
app.get('/students/:id', getStudents);
app.get('/student/:id', getStudentDetail);
app.delete('/students/:id', deleteStudents);
app.delete('/student/:id', deleteStudent);
app.put('/student/:id', updateStudent);
app.post('/student/attendance/:id', studentAttendance);
app.delete('/students/class/:id', deleteStudentsByClass);
app.put('/student/exam-result/:id', updateExamResult);
app.delete('/students/attendance/subject/:id', clearAllStudentsAttendanceBySubject);
app.delete('/students/attendance/:id', clearAllStudentsAttendance);
app.put('/student/attendance/subject/:id', removeStudentAttendanceBySubject);
app.put('/student/attendance/:id', removeStudentAttendance);

jest.mock('../models/studentSchema.js');
jest.mock('../models/subjectSchema.js');

describe('Student Controller', () => {
    describe('studentRegister', () => {
        it('should register a new student successfully', async () => {
            Student.findOne.mockResolvedValue(null);
            Student.prototype.save = jest.fn().mockResolvedValue({ _id: '1', rollNum: '123', password: undefined });

            const response = await request(app).post('/student/register').send({ rollNum: '123', password: 'password', adminID: '1', sclassName: 'class1' });

            expect(response.status).toBe(200);
            expect(response.body.rollNum).toBe('123');
        });

        it('should return error if roll number already exists', async () => {
            Student.findOne.mockResolvedValue({ _id: '1', rollNum: '123' });

            const response = await request(app).post('/student/register').send({ rollNum: '123', password: 'password', adminID: '1', sclassName: 'class1' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Roll Number already exists');
        });
    });

    describe('studentLogIn', () => {

        it('should return error if password is invalid', async () => {
            const student = { _id: '1', rollNum: '123', password: await bcrypt.hash('password', 10) };
            Student.findOne.mockResolvedValue(student);
            bcrypt.compare = jest.fn().mockResolvedValue(false);

            const response = await request(app).post('/student/login').send({ rollNum: '123', studentName: 'John', password: 'wrongpassword' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Invalid password');
        });

        it('should return error if student not found', async () => {
            Student.findOne.mockResolvedValue(null);

            const response = await request(app).post('/student/login').send({ rollNum: '123', studentName: 'John', password: 'password' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Student not found');
        });
    });

    describe('deleteStudents', () => {
        it('should delete all students successfully', async () => {
            Student.deleteMany.mockResolvedValue({ deletedCount: 1 });

            const response = await request(app).delete('/students/1');

            expect(response.status).toBe(200);
            expect(response.body.deletedCount).toBe(1);
        });

        it('should return message if no students found to delete', async () => {
            Student.deleteMany.mockResolvedValue({ deletedCount: 0 });

            const response = await request(app).delete('/students/1');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('No students found to delete');
        });
    });

    describe('deleteStudentsByClass', () => {
        it('should delete students by class successfully', async () => {
            Student.deleteMany.mockResolvedValue({ deletedCount: 1 });

            const response = await request(app).delete('/students/class/1');

            expect(response.status).toBe(200);
            expect(response.body.deletedCount).toBe(1);
        });

        it('should return message if no students found to delete by class', async () => {
            Student.deleteMany.mockResolvedValue({ deletedCount: 0 });

            const response = await request(app).delete('/students/class/1');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('No students found to delete');
        });
    });

    describe('updateExamResult', () => {
        it('should return error if student not found', async () => {
            Student.findById.mockResolvedValue(null);

            const response = await request(app).put('/student/exam-result/1').send({ subName: '1', marksObtained: 60 });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Student not found');
        });
    });

    describe('studentAttendance', () => {

        it('should return error if student not found', async () => {
            Student.findById.mockResolvedValue(null);

            const response = await request(app).post('/student/attendance/1').send({ subName: '1', status: 'Present', date: new Date() });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Student not found');
        });
    });

    describe('clearAllStudentsAttendanceBySubject', () => {
        it('should clear attendance by subject successfully', async () => {
            Student.updateMany.mockResolvedValue({ nModified: 1 });

            const response = await request(app).delete('/students/attendance/subject/1');

            expect(response.status).toBe(200);
            expect(response.body.nModified).toBe(1);
        });
    });

    describe('clearAllStudentsAttendance', () => {
        it('should clear all attendance successfully', async () => {
            Student.updateMany.mockResolvedValue({ nModified: 1 });

            const response = await request(app).delete('/students/attendance/1');

            expect(response.status).toBe(200);
            expect(response.body.nModified).toBe(1);
        });
    });

    describe('removeStudentAttendanceBySubject', () => {
        it('should remove attendance by subject successfully', async () => {
            Student.updateOne.mockResolvedValue({ nModified: 1 });

            const response = await request(app).put('/student/attendance/subject/1').send({ subId: '1' });

            expect(response.status).toBe(200);
            expect(response.body.nModified).toBe(1);
        });
    });

    describe('removeStudentAttendance', () => {
        it('should remove all attendance successfully', async () => {
            Student.updateOne.mockResolvedValue({ nModified: 1 });

            const response = await request(app).put('/student/attendance/1');

            expect(response.status).toBe(200);
            expect(response.body.nModified).toBe(1);
        });
    });
});