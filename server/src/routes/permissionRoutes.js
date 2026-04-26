const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');
const { createPermissionValidator } = require('../validators/permissionValidator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

// Resolve permissions for a user in a team
router.get('/', auth, permissionController.resolvePermissions);

// Get all available permissions from the Permission collection
router.get('/constants', auth, permissionController.getAllPermissions);

// Create a new permission
router.post('/', auth, createPermissionValidator, validate, permissionController.createPermission);

module.exports = router;
