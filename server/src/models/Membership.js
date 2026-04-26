const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: [true, 'Team ID is required'],
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: [true, 'Role ID is required'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound unique index: one role per user per team
membershipSchema.index({ userId: 1, teamId: 1 }, { unique: true });

// Index for quick lookups
membershipSchema.index({ teamId: 1 });
membershipSchema.index({ userId: 1 });

module.exports = mongoose.model('Membership', membershipSchema);
