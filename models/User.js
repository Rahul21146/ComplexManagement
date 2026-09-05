const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    role: {
      type: String,
      enum: ['owner', 'tenant'],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true }, // store a bcrypt/argon2 hash, never plaintext
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true } // adds createdAt / updatedAt
);

module.exports = mongoose.model('User', userSchema);
