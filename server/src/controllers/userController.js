const userService = require('../services/userService');
const ApiResponse = require('../utils/ApiResponse');

class UserController {
  async createUser(req, res, next) {
    try {
      const user = await userService.createUser(req.body);
      ApiResponse.created(user, 'User created successfully').send(res);
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      const { search, page, limit } = req.query;
      const result = await userService.getUsers({ search, page, limit });
      ApiResponse.success(result, 'Users fetched successfully').send(res);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);
      ApiResponse.success(user, 'User fetched successfully').send(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
