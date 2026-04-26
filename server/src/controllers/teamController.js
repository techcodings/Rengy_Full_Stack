const teamService = require('../services/teamService');
const ApiResponse = require('../utils/ApiResponse');

class TeamController {
  async createTeam(req, res, next) {
    try {
      const team = await teamService.createTeam({
        ...req.body,
        createdBy: req.user.id,
      });
      ApiResponse.created(team, 'Team created successfully').send(res);
    } catch (error) {
      next(error);
    }
  }

  async getTeams(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await teamService.getTeams({ page, limit });
      ApiResponse.success(result, 'Teams fetched successfully').send(res);
    } catch (error) {
      next(error);
    }
  }

  async getTeamById(req, res, next) {
    try {
      const team = await teamService.getTeamById(req.params.id);
      ApiResponse.success(team, 'Team fetched successfully').send(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TeamController();
