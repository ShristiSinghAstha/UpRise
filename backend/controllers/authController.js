import asyncHandler from 'express-async-handler';
import User from '../models/User.model.js';
import generateToken from '../utils/generateToken.js';
import { logger } from '../utils/logger.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  let { email, password } = req.body;
  if (email) email = email.trim().toLowerCase();

  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.comparePassword(password))) {
    logger.info(`Successful login: ${user.username} (${user.email}) - IP: ${req.ip}`);
    res.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
      accessToken: generateToken(user._id),
    });
  } else {
    logger.warn(`Failed login attempt for email: ${email} - IP: ${req.ip}`);
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    logger.warn(`Registration failed (User already exists) for email: ${email} - IP: ${req.ip}`);
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  if (user) {
    logger.info(`User registered: ${user.username} (${user.email}) - IP: ${req.ip}`);
    res.status(201).json({
      message: 'User registered',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
      accessToken: generateToken(user._id),
    });
  } else {
    logger.error(`Failed to create user record for email: ${email} - IP: ${req.ip}`);
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get current user profile
// @route   GET /api/v1/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    createdAt: req.user.createdAt,
  };
  res.status(200).json({ user });
});

// @desc    Logout user
// @route   POST /api/v1/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Update user profile
// @route   PUT /api/v1/update-profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      message: 'Profile updated',
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
      },
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Change password
// @route   PUT /api/v1/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (user && (await user.comparePassword(oldPassword))) {
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } else {
    res.status(401);
    throw new Error('Invalid old password');
  }
});

export { authUser, registerUser, getMe, logout, updateUserProfile, changePassword };
