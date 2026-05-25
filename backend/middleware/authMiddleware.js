import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.model.js';
import { logger } from '../utils/logger.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      logger.warn(`Auth Token Validation Failed: ${error.message} - Route: ${req.method} ${req.originalUrl}`);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    logger.warn(`Access Denied (No Token) - Route: ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const protectOptional = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      console.error("Optional Auth Token Failed:", error.message);
      // Do not throw, just continue without user
    }
  }
  next();
});

export { protect, protectOptional };
