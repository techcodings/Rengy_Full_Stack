const Team = require('../models/Team');
const ApiError = require('../utils/ApiError');

class TeamService {
  async createTeam({ name, description, createdBy }) {
    const existing = await Team.findOne({ name });
    if (existing) {
      throw ApiError.conflict('Team with this name already exists');
    }

    const team = await Team.create({ name, description, createdBy });
    return team;
  }

  async getTeams({ page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;

    const [teams, total] = await Promise.all([
      Team.find()
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Team.countDocuments(),
    ]);

    return {
      teams,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getTeamById(id) {
    const team = await Team.findById(id).populate('createdBy', 'name email');
    if (!team) {
      throw ApiError.notFound('Team not found');
    }
    return team;
  }
}

module.exports = new TeamService();
