const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Role name is required'],
      trim: true,
      unique: true,
      minlength: [2, 'Role name must be at least 2 characters'],
      maxlength: [30, 'Role name must be at most 30 characters'],
    },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
        required: true,
      },
    ],
    description: {
      type: String,
      trim: true,
      maxlength: [100, 'Description must be at most 100 characters'],
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

// Validate that at least one permission is assigned
roleSchema.pre('validate', function (next) {
  if (!this.permissions || this.permissions.length === 0) {
    this.invalidate('permissions', 'At least one permission is required');
  }
  next();
});

module.exports = mongoose.model('Role', roleSchema);
