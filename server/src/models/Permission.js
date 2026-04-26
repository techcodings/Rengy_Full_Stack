const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Permission name is required'],
      unique: true,
      trim: true,
      uppercase: true,
      match: [/^[A-Z_]+$/, 'Permission name must be UPPER_SNAKE_CASE'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [150, 'Description must be at most 150 characters'],
      default: '',
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

module.exports = mongoose.model('Permission', permissionSchema);
