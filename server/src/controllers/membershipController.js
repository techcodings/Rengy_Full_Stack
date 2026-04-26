const membershipService = require('../services/membershipService');
const ApiResponse = require('../utils/ApiResponse');

class MembershipController {
  async addMember(req, res, next) {
    try {
      const { userId, roleId } = req.body;
      const teamId = req.params.id;
      const membership = await membershipService.addMember({ userId, teamId, roleId });
      ApiResponse.created(membership, 'Member added to team successfully').send(res);
    } catch (error) {
      next(error);
    }
  }

  async removeMember(req, res, next) {
    try {
      const { userId } = req.body;
      const teamId = req.params.id;
      await membershipService.removeMember({ userId, teamId });
      ApiResponse.success(null, 'Member removed from team successfully').send(res);
    } catch (error) {
      next(error);
    }
  }

  async getTeamMembers(req, res, next) {
    try {
      const members = await membershipService.getTeamMembers(req.params.id);
      ApiResponse.success(members, 'Team members fetched successfully').send(res);
    } catch (error) {
      next(error);
    }
  }

  async assignRole(req, res, next) {
    try {
      const membership = await membershipService.assignRole(req.body);
      ApiResponse.created(membership, 'Role assigned successfully').send(res);
    } catch (error) {
      next(error);
    }
  }

  async updateRole(req, res, next) {
    try {
      const membership = await membershipService.updateRole(req.body);
      ApiResponse.success(membership, 'Role updated successfully').send(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MembershipController();
