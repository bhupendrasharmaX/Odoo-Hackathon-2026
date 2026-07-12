import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { sendError } from '../utils/response.js';

/**
 * General API rate limiter
 */
export const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError(res, 'Too many requests, please try again later', 429, 'RATE_LIMIT');
  },
});

/**
 * Strict OTP rate limiter — max 5 OTP requests per hour
 */
export const otpLimiter = rateLimit({
  windowMs: env.OTP_RATE_LIMIT_WINDOW_MS,
  max: env.OTP_RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.body?.mobileNumber || req.ip || 'unknown';
  },
  handler: (_req, res) => {
    sendError(
      res,
      'Maximum OTP requests exceeded. Please try again later.',
      429,
      'OTP_RATE_LIMITED'
    );
  },
});
