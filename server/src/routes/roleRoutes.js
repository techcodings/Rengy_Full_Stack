const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { createRoleValidator } = require('../validators/roleValidator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

router.post('/', auth, createRoleValidator, validate, roleController.createRole);
router.get('/', auth, roleController.getRoles);

module.exports = router;
