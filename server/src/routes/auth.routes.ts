import { Router } from 'express';
import { authController } from '../controllers/index.js';
import { authenticate, otpLimiter, validate } from '../middlewares/index.js';
import { sendOtpSchema, verifyOtpSchema, refreshTokenSchema } from '../validators/auth.validator.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

const router = Router();

router.post('/send-otp', otpLimiter, validate(sendOtpSchema), asyncHandler(authController.sendOtp));
router.post('/verify-otp', validate(verifyOtpSchema), asyncHandler(authController.verifyOtp));
router.post('/login', asyncHandler(authController.login)); // fallback login with email/pass
router.post('/logout', authenticate, asyncHandler(authController.logout));
router.post('/refresh-token', validate(refreshTokenSchema), asyncHandler(authController.refreshToken));
router.get('/profile', authenticate, asyncHandler(authController.getProfile));

export default router;
