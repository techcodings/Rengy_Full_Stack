const { body } = require('express-validator');

const createRoleValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Role name is required')
    .isLength({ min: 2, max: 30 }).withMessage('Role name must be 2-30 characters'),
  body('permissions')
    .isArray({ min: 1 }).withMessage('At least one permission is required')
    .custom((perms) => {
      const invalid = perms.filter((p) => !p.match(/^[a-f\d]{24}$/i));
      if (invalid.length > 0) {
        throw new Error('All permissions must be valid Permission IDs');
      }
      return true;
    }),
  body('permissions.*')
    .isMongoId().withMessage('Each permission must be a valid Permission ID'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Description must be at most 100 characters'),
];

module.exports = { createRoleValidator };
