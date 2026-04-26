/**
 * Default permission definitions.
 * Used by the seed script to populate the Permission collection.
 * The Permission collection is the single source of truth at runtime.
 */
const DEFAULT_PERMISSIONS = [
  { name: 'CREATE_TASK', description: 'Create new tasks and assignments' },
  { name: 'EDIT_TASK', description: 'Modify existing tasks and details' },
  { name: 'DELETE_TASK', description: 'Permanently remove tasks' },
  { name: 'VIEW_ONLY', description: 'Read-only access to team content' },
];

module.exports = { DEFAULT_PERMISSIONS };
