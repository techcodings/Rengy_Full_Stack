const roleService = require('../services/roleService');
const ApiResponse = require('../utils/ApiResponse');

class RoleController {
  async createRole(req, res, next) {
    try {
      const role = await roleService.createRole(req.body);
      ApiResponse.created(role, 'Role created successfully').send(res);
    } catch (error) {
      next(error);
    }
  }

  async getRoles(req, res, next) {
    try {
      const roles = await roleService.getRoles();
      ApiResponse.success(roles, 'Roles fetched successfully').send(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RoleController();
