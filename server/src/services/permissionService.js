const Membership = require('../models/Membership');
const Permission = require('../models/Permission');
const ApiError = require('../utils/ApiError');

class PermissionService {
  /**
   * Resolve effective permissions for a user in a specific team.
   * Steps:
   * 1. Find membership (userId + teamId)
   * 2. Populate role → populate role.permissions (deep)
   * 3. Extract permission names as strings
   * 4. Return permissions (or empty if no membership)
   */
  async resolvePermissions(userId, teamId) {
    if (!userId || !teamId) {
      throw ApiError.badRequest('Both userId and teamId are required');
    }

    const membership = await Membership.findOne({ userId, teamId })
      .populate({
        path: 'roleId',
        select: 'name permissions',
        populate: {
          path: 'permissions',
          model: 'Permission',
          select: 'name description',
        },
      })
      .populate('userId', 'name email')
      .populate('teamId', 'name');

    if (!membership || !membership.roleId) {
      return {
        user: null,
        team: null,
        role: null,
        permissions: [],
        hasAccess: false,
      };
    }

    // Extract permission name strings for backward-compatible API response
    const permissionNames = membership.roleId.permissions.map((p) => p.name);

    return {
      user: membership.userId,
      team: membership.teamId,
      role: {
        _id: membership.roleId._id,
        name: membership.roleId.name,
      },
      permissions: permissionNames,
      hasAccess: true,
    };
  }

  /**
   * Check if a user has a specific permission in a team.
   * Accepts permission NAME string (e.g. 'CREATE_TASK')
   */
  async hasPermission(userId, teamId, permissionName) {
    const resolved = await this.resolvePermissions(userId, teamId);
    return resolved.permissions.includes(permissionName);
  }

  /**
   * Get all available permissions from the Permission collection
   */
  async getAllPermissions() {
    return Permission.find().sort({ name: 1 });
  }

  /**
   * Create a new permission
   */
  async createPermission({ name, description }) {
    const existing = await Permission.findOne({ name });
    if (existing) {
      throw ApiError.conflict(`Permission '${name}' already exists`);
    }

    const permission = await Permission.create({ name, description });
    return permission;
  }
}

module.exports = new PermissionService();
