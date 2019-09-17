const express = require('express');
const router = express.Router();
const {
  Users,
  StudentTeachers,
  Sequelize,
} = require('../../../db/models');
const { errorMessageHelper } = require('../../../utils/message');
const {
  isArray,
  isString,
  validateField,
  validateArray,
  validateAndFilterArray,
} = require('../../../utils/validator');

/*
 * Retrieve by @ and registered students notification flow
 * 1. Request body validation.
 * 2. Retrieve authorized notification.
*/

router.post('/retrievefornotifications', async (req, res, next) => {
  try {
    const { teacher, notification } = req.body;
    // simple body validation
    if (!teacher && !notification) {
      return res.status(400).json({ message: 'Please provides teacher email and notification' });
    } else if (!teacher) {
      return res.status(400).json({ message: 'Please provide teacher email' });
    } else if (!notification) {
      return res.status(400).json({ message: 'Please provide student notification' });
    }
    if (!(isString(teacher))) {
      return res.status(400).json({ message: 'teacher field only support String data type.' });
    }
    if (!(isString(notification))) {
      return res.status(400).json({ message: 'notification field only support String data type.' });
    }
    // teacher email validation
    if (!validateField(teacher)) {
      return res.status(400).json({ message: 'Please provide valid teacher email' });
    }
    // Integrity checking: teacher
    const teacherRawData = await Users.findOne({
      where: {
        email: teacher,
        role: 'teacher',
      },
      raw: true,
    });
    if (!teacherRawData) {
      return res.status(400).json({ message: 'Please ensure the provided teacher email is exist.' });
    }
    // notification email validation
    const notificationWords = notification.split(' ');
    const studentSet = new Set(); // remove duplicates/repetitions
    /*
     * Notification extract flow
     * 1. find word starts with '@'
     * 2. @student@example.com -> student@example.com
     * 3. add student@example.com into Set
    */
    notificationWords.map(word => {
      if (word[0] === '@') {
        studentSet.add(word.slice(1));
      }
    });
    const students = validateAndFilterArray(Array.from(studentSet));
    const studentsRawData = await Users.findAll({
      where: {
        email: students,
        role: 'student',
        status: {
          [Sequelize.Op.ne]: 'suspend',
        }
      },
      raw: true,
    });
    const restructStudents = [];
    studentsRawData.map(student => {
      restructStudents.push(student.email);
    });
    const registeredStudentRawData = await StudentTeachers.findAll({
      attributes: [],
      where: {
        teacherId: teacherRawData.id,
      },
      include: [
        {
          model: Users,
          as: 'students',
          required: true,
          where: {
            status: {
              [Sequelize.Op.ne]: 'suspend',
            },
          },
          raw: true,
        }
      ],
    })

    const restructRegisteredStudents = [];
    registeredStudentRawData.map(student => {
      restructRegisteredStudents.push(student.students.email);
    });

    const receivedStudentSet = new Set([...restructStudents, ...restructRegisteredStudents]);
    const receivedStudents = Array.from(receivedStudentSet);

    return res
      .status(200)
      .json(receivedStudents);
  } catch (err) {
    if (err.errors) {
      const message = errorMessageHelper(err.errors);
      return res
        .status(400)
        .json({ message });
    }
    return next(err);
  }
});

module.exports = router;
