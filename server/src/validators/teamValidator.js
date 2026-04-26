const { body } = require('express-validator');

const createTeamValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Team name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Team name must be 2-50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Description must be at most 200 characters'),
];

module.exports = { createTeamValidator };
