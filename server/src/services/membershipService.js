const Membership = require('../models/Membership');
const User = require('../models/User');
const Team = require('../models/Team');
const Role = require('../models/Role');
const ApiError = require('../utils/ApiError');

/**
 * Helper: deep populate roleId → permissions
 */
const populateRoleWithPermissions = {
  path: 'roleId',
  select: 'name permissions',
  populate: {
    path: 'permissions',
    model: 'Permission',
    select: 'name description',
  },
};

class MembershipService {
  async addMember({ userId, teamId, roleId }) {
    // Validate references exist
    const [user, team, role] = await Promise.all([
      User.findById(userId),
      Team.findById(teamId),
      Role.findById(roleId),
    ]);

    if (!user) throw ApiError.notFound('User not found');
    if (!team) throw ApiError.notFound('Team not found');
    if (!role) throw ApiError.notFound('Role not found');

    // Check if membership already exists
    const existing = await Membership.findOne({ userId, teamId });
    if (existing) {
      throw ApiError.conflict('User is already a member of this team');
    }

    const membership = await Membership.create({ userId, teamId, roleId });
    return Membership.findById(membership._id)
      .populate('userId', 'name email')
      .populate('teamId', 'name')
      .populate(populateRoleWithPermissions);
  }

  async removeMember({ userId, teamId }) {
    const membership = await Membership.findOneAndDelete({ userId, teamId });
    if (!membership) {
      throw ApiError.notFound('Membership not found');
    }
    return membership;
  }

  async getTeamMembers(teamId) {
    const team = await Team.findById(teamId);
    if (!team) throw ApiError.notFound('Team not found');

    const members = await Membership.find({ teamId })
      .populate('userId', 'name email')
      .populate(populateRoleWithPermissions)
      .sort({ createdAt: -1 });

    return members;
  }

  async assignRole({ userId, teamId, roleId }) {
    // Validate references exist
    const [user, team, role] = await Promise.all([
      User.findById(userId),
      Team.findById(teamId),
      Role.findById(roleId),
    ]);

    if (!user) throw ApiError.notFound('User not found');
    if (!team) throw ApiError.notFound('Team not found');
    if (!role) throw ApiError.notFound('Role not found');

    // Check if membership exists
    const existing = await Membership.findOne({ userId, teamId });
    if (existing) {
      throw ApiError.conflict('User already has a role in this team. Use update-role instead.');
    }

    const membership = await Membership.create({ userId, teamId, roleId });
    return Membership.findById(membership._id)
      .populate('userId', 'name email')
      .populate('teamId', 'name')
      .populate(populateRoleWithPermissions);
  }

  async updateRole({ userId, teamId, roleId }) {
    const role = await Role.findById(roleId);
    if (!role) throw ApiError.notFound('Role not found');

    const membership = await Membership.findOneAndUpdate(
      { userId, teamId },
      { roleId },
      { new: true }
    )
      .populate('userId', 'name email')
      .populate('teamId', 'name')
      .populate(populateRoleWithPermissions);

    if (!membership) {
      throw ApiError.notFound('Membership not found. Assign a role first.');
    }

    return membership;
  }

  async getMembershipByUserAndTeam(userId, teamId) {
    return Membership.findOne({ userId, teamId })
      .populate(populateRoleWithPermissions);
  }
}

module.exports = new MembershipService();
