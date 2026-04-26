const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController');
const { assignRoleValidator } = require('../validators/membershipValidator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

router.post('/assign-role', auth, assignRoleValidator, validate, membershipController.assignRole);
router.put('/update-role', auth, assignRoleValidator, validate, membershipController.updateRole);

module.exports = router;
