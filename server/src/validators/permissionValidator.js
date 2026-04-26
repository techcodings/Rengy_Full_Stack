const { body } = require('express-validator');

const createPermissionValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Permission name is required')
    .matches(/^[A-Z_]+$/).withMessage('Permission name must be UPPER_SNAKE_CASE (e.g. CREATE_TASK)'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 150 }).withMessage('Description must be at most 150 characters'),
];

module.exports = { createPermissionValidator };
