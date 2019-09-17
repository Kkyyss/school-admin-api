const express = require('express');
const router = express.Router();
const {
  Users,
  StudentTeachers,
} = require('../../../db/models');
const {errorMessageHelper} = require('../../../utils/message');
const {
  isArray,
  isString,
  validateField,
  validateArray,
} = require('../../../utils/validator');

/*
 * Register flow
 * 1. Create teacher and students if not exist.
 * 2. Register students to the teacher.

 * teacher:string
 * students:Array
*/
router.post('/register', async (req, res, next) => {
  try {
    const { teacher, students } = req.body;
    // simple body validation
    if (!teacher && !students) {
      return res.status(400).json({ message: 'Please provides teacher email and student email(s)' });
    } else if (!teacher) {
      return res.status(400).json({ message: 'Please provide teacher email' });
    } else if (!students) {
      return res.status(400).json({ message: 'Please provide student email(s)' });
    }
    if (!(isString(teacher))) {
      return res.status(400).json({ message: 'teacher field only support String data type.' });
    }
    if (!(isArray(students))) {
      return res.status(400).json({ message: 'students field only support Array data structure.' });
    }
    // teacher email validation
    if (!validateField(teacher)) {
      return res.status(400).json({ message: 'Please provide valid teacher email' });
    }
    // students' email validation
    if (!validateArray(students)) {
      return res.status(400).json({ message: 'Please provide valid student email(s)' });
    }

    // find or create teacher if not exist.
    let [teacherRawData, _] = await Users
      .findOrCreate(
        {
          where: {
            email: teacher,
          },
          defaults: {
            role: 'teacher',
          }
        }
      );
    // restruct students
    const restructStudents = [];
    students.map(student => {
      restructStudents.push({ email: student, role: 'student' })
    });
    // create students if not exist.
    await Users
      .bulkCreate(restructStudents, {
        ignoreDuplicates: true,
        raw: true,
        validate: true,
      });
    // Get all students' id
    const studentsRawData = await Users.findAll({
      where: {
        email: students,
      },
      raw: true,
    });
    const studentIds = [];
    studentsRawData.map(student => {
      studentIds.push(student.id);
    });
    // Get all registered students
    const regStudentsRawData = await StudentTeachers.findAll({
      where: {
        studentId: studentIds,
        teacherId: teacherRawData.id,
      },
      raw: true,
    });
    // restruct teacher's students
    const mapExistRegStudents = {}
    regStudentsRawData.map(student => {
      mapExistRegStudents[student.studentId] = true;
    });
    const filteredStudents = studentsRawData
      .filter(student => !(student.id in mapExistRegStudents));
    const studentTeachers = [];
    filteredStudents.map(student => {
      studentTeachers
        .push(
          {
            teacherId: teacherRawData.id,
            studentId: student.id,
          },
        );
    });
    // register students to the teacher.
    await StudentTeachers
      .bulkCreate(
        studentTeachers,
        {
          raw: true,
        },
      );

    return res.sendStatus(204); // 204 no content
  } catch (err) {
    if (err.errors) {
      const message = errorMessageHelper(err.errors);
      return res.status(400).json({ message });
    }
    return next(err);
  }
});

module.exports = router;
