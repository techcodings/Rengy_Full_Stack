const authService = require('../services/authService');
const ApiResponse = require('../utils/ApiResponse');

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      ApiResponse.created(result, 'User registered successfully').send(res);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      ApiResponse.success(result, 'Login successful').send(res);
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const user = await authService.getMe(req.user.id);
      ApiResponse.success(user, 'User profile fetched').send(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
