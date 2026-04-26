const { body } = require('express-validator');

const addMemberValidator = [
  body('userId')
    .notEmpty().withMessage('User ID is required')
    .isMongoId().withMessage('Invalid User ID'),
  body('roleId')
    .notEmpty().withMessage('Role ID is required')
    .isMongoId().withMessage('Invalid Role ID'),
];

const removeMemberValidator = [
  body('userId')
    .notEmpty().withMessage('User ID is required')
    .isMongoId().withMessage('Invalid User ID'),
];

const assignRoleValidator = [
  body('userId')
    .notEmpty().withMessage('User ID is required')
    .isMongoId().withMessage('Invalid User ID'),
  body('teamId')
    .notEmpty().withMessage('Team ID is required')
    .isMongoId().withMessage('Invalid Team ID'),
  body('roleId')
    .notEmpty().withMessage('Role ID is required')
    .isMongoId().withMessage('Invalid Role ID'),
];

module.exports = { addMemberValidator, removeMemberValidator, assignRoleValidator };
