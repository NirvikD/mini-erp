// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Assuming you've installed this library

const userSchema = new mongoose.Schema({
  // ... (previous fields are the same)
  name: { type: String, required: true, trim: true, minlength: 3 },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['DeptHead', 'ProcurementOfficer', 'Vendor'], required: true, default: 'DeptHead' }
}, { timestamps: true });

// Mongoose pre-save hook to hash the password before saving
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with the hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);