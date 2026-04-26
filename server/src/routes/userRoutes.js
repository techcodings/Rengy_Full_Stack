const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { createUserValidator } = require('../validators/userValidator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

router.post('/', auth, createUserValidator, validate, userController.createUser);
router.get('/', auth, userController.getUsers);
router.get('/:id', auth, userController.getUserById);

module.exports = router;
