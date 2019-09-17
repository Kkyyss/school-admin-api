const express = require('express');
const router = express.Router();
const { Users } = require('../../../db/models');
const { errorMessageHelper } = require('../../../utils/message');
const {
  isString,
  validateField,
} = require('../../../utils/validator');

/*
 * Suspend student flow
 * 1. Request body validation.
 * 2. Suspend student.
*/

router.post('/suspend', async (req, res, next) => {
  try {
    const { student } = req.body;
    // simple body validation
    if (!student) {
      return res.status(400).json({ message: 'Please provide student email' });
    }
    if (!(isString(student))) {
      return res.status(400).json({ message: 'student field only support String data type.' });
    }
    // student email validation
    if (!validateField(student)) {
      return res.status(400).json({ message: 'Please provide valid student email' });
    }
    // Integrity checking
    const studentRawData = await Users.findOne({
      where: {
        email: student,
        role: 'student',
      },
      raw: true,
    });
    if (!studentRawData) {
      return res.status(400).json({ message: 'Please ensure the provided student email is exist.' });
    }
    // Suspend student
    await Users.update({
      status: 'suspend',
    }, {
      where: {
        id: studentRawData.id,
      },
    })

    return res.sendStatus(204);
  } catch (err) {
    if (err.errors) {
      const message = errorMessageHelper(err.errors);
      return res.status(400).json({ message });
    }
    return next(err);
  }
});

module.exports = router;
