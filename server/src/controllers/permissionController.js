const permissionService = require('../services/permissionService');
const ApiResponse = require('../utils/ApiResponse');

class PermissionController {
  async resolvePermissions(req, res, next) {
    try {
      const { userId, teamId } = req.query;
      const result = await permissionService.resolvePermissions(userId, teamId);
      ApiResponse.success(result, 'Permissions resolved successfully').send(res);
    } catch (error) {
      next(error);
    }
  }

  async getAllPermissions(req, res, next) {
    try {
      const permissions = await permissionService.getAllPermissions();
      ApiResponse.success(permissions, 'Available permissions fetched').send(res);
    } catch (error) {
      next(error);
    }
  }

  async createPermission(req, res, next) {
    try {
      const permission = await permissionService.createPermission(req.body);
      ApiResponse.created(permission, 'Permission created successfully').send(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PermissionController();
