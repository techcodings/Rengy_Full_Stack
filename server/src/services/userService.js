const User = require('../models/User');
const ApiError = require('../utils/ApiError');

class UserService {
  async createUser({ name, email, password }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.conflict('User with this email already exists');
    }

    const user = await User.create({ name, email, password });
    return user;
  }

  async getUsers({ search, page = 1, limit = 10 }) {
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(query),
    ]);

    return {
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return user;
  }
}

module.exports = new UserService();
