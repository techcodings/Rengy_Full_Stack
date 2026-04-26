const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const membershipController = require('../controllers/membershipController');
const { createTeamValidator } = require('../validators/teamValidator');
const { addMemberValidator, removeMemberValidator } = require('../validators/membershipValidator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

// Team CRUD
router.post('/', auth, createTeamValidator, validate, teamController.createTeam);
router.get('/', auth, teamController.getTeams);
router.get('/:id', auth, teamController.getTeamById);

// Team membership
router.post('/:id/add-user', auth, addMemberValidator, validate, membershipController.addMember);
router.delete('/:id/remove-user', auth, removeMemberValidator, validate, membershipController.removeMember);
router.get('/:id/members', auth, membershipController.getTeamMembers);

module.exports = router;
