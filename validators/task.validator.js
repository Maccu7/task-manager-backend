const { body } = require('express-validator');

exports.createTaskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date')
    .custom((value) => {
      if (value && new Date(value) < new Date()) {
        throw new Error('Due date cannot be in the past');
      }
      return true;
    }),
  
  body('isCompleted')
    .optional()
    .isBoolean()
    .withMessage('isCompleted must be a boolean value')
];
