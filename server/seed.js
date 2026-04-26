/**
 * Database Seed Script
 * Seeds the database with sample data:
 * - 4 Permissions (CREATE_TASK, EDIT_TASK, DELETE_TASK, VIEW_ONLY)
 * - 3 Roles (Admin, Manager, Viewer) referencing Permission ObjectIds
 * - 5 Users
 * - 3 Teams
 * - Memberships (User-Team-Role mappings)
 *
 * Run: npm run seed  (or)  node seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { MONGODB_URI } = require('./src/config/env');
const { DEFAULT_PERMISSIONS } = require('./src/constants/permissions');

const User = require('./src/models/User');
const Team = require('./src/models/Team');
const Role = require('./src/models/Role');
const Permission = require('./src/models/Permission');
const Membership = require('./src/models/Membership');

const seedDB = async () => {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Role.deleteMany({}),
      Permission.deleteMany({}),
      Membership.deleteMany({}),
    ]);

    // ─── Create Permissions ──────────────────────────────────────
    console.log('🔑 Creating permissions...');
    const permissions = await Permission.insertMany(DEFAULT_PERMISSIONS);

    const permMap = {};
    permissions.forEach((p) => { permMap[p.name] = p._id; });
    console.log(`   ✓ Created ${permissions.length} permissions`);

    // ─── Create Roles (referencing Permission ObjectIds) ─────────
    console.log('📋 Creating roles...');
    const roles = await Role.insertMany([
      {
        name: 'Admin',
        permissions: [permMap.CREATE_TASK, permMap.EDIT_TASK, permMap.DELETE_TASK, permMap.VIEW_ONLY],
        description: 'Full access to all team operations',
      },
      {
        name: 'Manager',
        permissions: [permMap.CREATE_TASK, permMap.EDIT_TASK, permMap.VIEW_ONLY],
        description: 'Can create and edit tasks, but cannot delete',
      },
      {
        name: 'Viewer',
        permissions: [permMap.VIEW_ONLY],
        description: 'Read-only access to team content',
      },
    ]);

    const [adminRole, managerRole, viewerRole] = roles;
    console.log(`   ✓ Created ${roles.length} roles`);

    // ─── Create Users ────────────────────────────────────────────
    console.log('👤 Creating users...');
    const users = await User.create([
      { name: 'Alice Johnson', email: 'alice@example.com', password: 'password123' },
      { name: 'Bob Smith', email: 'bob@example.com', password: 'password123' },
      { name: 'Charlie Brown', email: 'charlie@example.com', password: 'password123' },
      { name: 'Diana Prince', email: 'diana@example.com', password: 'password123' },
      { name: 'Eve Williams', email: 'eve@example.com', password: 'password123' },
    ]);

    const [alice, bob, charlie, diana, eve] = users;
    console.log(`   ✓ Created ${users.length} users`);

    // ─── Create Teams ────────────────────────────────────────────
    console.log('👥 Creating teams...');
    const teams = await Team.insertMany([
      { name: 'Team Alpha', description: 'Frontend development team', createdBy: alice._id },
      { name: 'Team Beta', description: 'Backend API team', createdBy: bob._id },
      { name: 'Team Gamma', description: 'DevOps and infrastructure', createdBy: charlie._id },
    ]);

    const [teamAlpha, teamBeta, teamGamma] = teams;
    console.log(`   ✓ Created ${teams.length} teams`);

    // ─── Create Memberships (User-Team-Role Mapping) ─────────────
    console.log('🔗 Creating memberships...');
    const memberships = await Membership.insertMany([
      // Team Alpha
      { userId: alice._id, teamId: teamAlpha._id, roleId: adminRole._id },
      { userId: bob._id, teamId: teamAlpha._id, roleId: managerRole._id },
      { userId: charlie._id, teamId: teamAlpha._id, roleId: viewerRole._id },

      // Team Beta
      { userId: bob._id, teamId: teamBeta._id, roleId: adminRole._id },
      { userId: alice._id, teamId: teamBeta._id, roleId: viewerRole._id },
      { userId: diana._id, teamId: teamBeta._id, roleId: managerRole._id },

      // Team Gamma
      { userId: charlie._id, teamId: teamGamma._id, roleId: adminRole._id },
      { userId: eve._id, teamId: teamGamma._id, roleId: managerRole._id },
      { userId: diana._id, teamId: teamGamma._id, roleId: viewerRole._id },
    ]);

    console.log(`   ✓ Created ${memberships.length} memberships`);

    // ─── Summary ─────────────────────────────────────────────────
    console.log('\n════════════════════════════════════════════');
    console.log('  🎉 Database seeded successfully!');
    console.log('════════════════════════════════════════════');
    console.log(`  Permissions: ${permissions.length}`);
    console.log(`  Roles:       ${roles.length}`);
    console.log(`  Users:       ${users.length}`);
    console.log(`  Teams:       ${teams.length}`);
    console.log(`  Memberships: ${memberships.length}`);
    console.log('════════════════════════════════════════════');
    console.log('\n📌 Sample User-Team-Role Mappings:');
    console.log('  • Alice → Admin in Team Alpha, Viewer in Team Beta');
    console.log('  • Bob → Manager in Team Alpha, Admin in Team Beta');
    console.log('  • Charlie → Viewer in Team Alpha, Admin in Team Gamma');
    console.log('\n📧 Login credentials (any user):');
    console.log('  Email: alice@example.com');
    console.log('  Password: password123');
    console.log('');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    console.error(error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDB();
