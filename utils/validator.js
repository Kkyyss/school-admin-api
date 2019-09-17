const validator = require('email-validator');

// validate email and return boolean.
const validateField = field => validator.validate(field);

// validate array of emails and return boolean.
const validateArray = arr => {
  return arr.every(field => {
    if (!validateField(field)) {
      return false;
    }
    return true;
  });
};

// validate array of emails and return boolean.
const validateAndFilterArray = arr => arr.filter(field => validateField(field));

// Validate value is string and return boolean.
const isString = value => typeof value === 'string' || value instanceof String;

// Validate value is array and return boolean.
const isArray = value => Array.isArray(value);

exports.isArray = isArray;
exports.isString = isString;
exports.validateField = validateField;
exports.validateArray = validateArray;
exports.validateAndFilterArray = validateAndFilterArray;
