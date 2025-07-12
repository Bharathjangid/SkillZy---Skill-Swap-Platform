const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  location: {
    city: { type: String, trim: true },
    country: { type: String, trim: true }
  },
  profilePicture: {
    type: String,
    trim: true
  },
  skillsWanted: {
    type: [String],
    default: []
  },
  skillsOffered: {
    type: [String],
    default: []
  },
  bio: {
    type: String,
    trim: true
  },
  availability: {
    type: [String],
    default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
