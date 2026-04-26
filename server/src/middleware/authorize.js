const permissionService = require('../services/permissionService');
const ApiError = require('../utils/ApiError');

/**
 * Authorization Middleware Factory
 * Usage: checkPermission('CREATE_TASK')
 *
 * Flow:
 * 1. Extract userId from req.user (set by auth middleware)
 * 2. Extract teamId from req.body, req.query, or req.params
 * 3. Resolve user's role in that team via Membership
 * 4. Check if role has the required permission
 * 5. Allow or deny
 */
const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw ApiError.unauthorized('Authentication required');
      }

      // teamId can come from body, query params, or route params
      const teamId = req.body.teamId || req.query.teamId || req.params.id || req.params.teamId;
      if (!teamId) {
        throw ApiError.badRequest('Team ID is required for authorization');
      }

      const hasAccess = await permissionService.hasPermission(userId, teamId, requiredPermission);

      if (!hasAccess) {
        throw ApiError.forbidden(
          `You do not have the '${requiredPermission}' permission in this team`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { checkPermission };
