const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
      unique: true,
      minlength: [2, 'Team name must be at least 2 characters'],
      maxlength: [50, 'Team name must be at most 50 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description must be at most 200 characters'],
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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

module.exports = mongoose.model('Team', teamSchema);
