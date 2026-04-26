const Role = require('../models/Role');
const Permission = require('../models/Permission');
const ApiError = require('../utils/ApiError');

class RoleService {
  async createRole({ name, permissions, description }) {
    const existing = await Role.findOne({ name });
    if (existing) {
      throw ApiError.conflict('Role with this name already exists');
    }

    // Validate all permission IDs exist in the Permission collection
    const validPermissions = await Permission.find({ _id: { $in: permissions } });
    if (validPermissions.length !== permissions.length) {
      const validIds = validPermissions.map((p) => p._id.toString());
      const invalid = permissions.filter((id) => !validIds.includes(id));
      throw ApiError.badRequest(`Invalid permission IDs: ${invalid.join(', ')}`);
    }

    const role = await Role.create({ name, permissions, description });

    // Return with populated permissions
    return Role.findById(role._id).populate('permissions', 'name description');
  }

  async getRoles() {
    const roles = await Role.find()
      .populate('permissions', 'name description')
      .sort({ createdAt: -1 });
    return roles;
  }

  async getRoleById(id) {
    const role = await Role.findById(id).populate('permissions', 'name description');
    if (!role) {
      throw ApiError.notFound('Role not found');
    }
    return role;
  }
}

module.exports = new RoleService();
