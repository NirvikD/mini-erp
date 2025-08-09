const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // You will need this for the login function
const User = require('../models/User');

/**
 * @desc    Authenticates a user and generates a JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Return a generic error message for security reasons
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // Use the model's method to compare the password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      // Return a generic error message for security reasons
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // Sign a new JWT with user id and role
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, role: user.role });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

/**
 * @desc    Registers a new user and generates a JWT token
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
  // Use a more secure approach by always defaulting the role
  const { name, email, password } = req.body;
  const role = 'DeptHead'; // Hardcode the role for security

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create a new user. The password will be hashed automatically
    // by the pre-save hook in the User model.
    const newUser = new User({ name, email, password, role });
    await newUser.save();

    // Sign JWT
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({ token, role: newUser.role });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
