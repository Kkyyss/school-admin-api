const express = require('express');
const router = express.Router();
const {
  Users,
  Sequelize,
  StudentTeachers,
} = require('../../../db/models');
const { errorMessageHelper } = require('../../../utils/message');
const {
  isArray,
  validateArray,
} = require('../../../utils/validator');

/*
 * Common students flow
 * 1. Request query validation.
 * 2. Register students to the teacher.
 *
 * teacher:Array | string
*/

router.get('/commonstudents', async(req, res, next) => {
  try {
    const { teacher } = req.query; // extract data from query.
    // simple query validation
    if (!teacher) {
      return res
        .status(400).json({ message: 'Please provide teacher email(s)' });
    }
    // Convert teacher to list.
    const teacherList = !(isArray(teacher)) ? [teacher] : teacher;
    // teacher email validation
    if (!validateArray(teacherList)) {
      return res
        .status(400).json({ message: 'Please provide valid teacher email(s)' });
    }
    // Retrieve the teahcer ids.
    const teacherIds = await Users.findAll({
      attributes: ['id'],
      where: {
        email: teacherList,
      },
      raw: true,
    });
    // Integrity checking
    if (teacherIds.length !== teacherList.length) {
      return res
        .status(400)
        .json({
          message: 'Please ensure the provided teacher email(s) are exist.' });
    }

    const restructTeacherIds = [];
    teacherIds.map(teacher => {
      restructTeacherIds.push(teacher.id);
    });

    // Retrieve common students from the given teachers.
    const commonStudents = await StudentTeachers.findAll({
      attributes: [Sequelize.fn('COUNT', Sequelize.col('teacherId'))],
      where: {
        teacherId: {
          [Sequelize.Op.in]: restructTeacherIds,
        },
      },
      include: [
        {
          model: Users,
          as: 'students',
          attributes: ['email'],
          required: true,
          raw: true,
        },
      ],
      group: 'students.id',
      having: Sequelize.where(
        Sequelize.fn(
          'COUNT',
          Sequelize.col('teacherId')), '>=', restructTeacherIds.length),
    });
    // restruct response
    const students = [];
    commonStudents.map(student => {
      students.push(student.students.email);
    });

    return res.status(200).json({ students });
  } catch (err) {
    if (err.errors) {
      const message = errorMessageHelper(err.errors);
      return res.status(400).json({ message });
    }
    return next(err);
  }
});

module.exports = router;
