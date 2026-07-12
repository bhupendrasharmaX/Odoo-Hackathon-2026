import type { Request, Response } from 'express';
import { authService } from '../services/index.js';
import { sendSuccess } from '../utils/response.js';
import type { AuthRequest } from '../types/index.js';
import { auditService } from '../services/audit.service.js';

export const authController = {
  async sendOtp(req: Request, res: Response) {
    const { mobileNumber } = req.body;
    await authService.sendLoginOtp(mobileNumber);
    sendSuccess(res, null, 'OTP sent successfully');
  },

  async verifyOtp(req: Request, res: Response) {
    const { mobileNumber, otp } = req.body;
    const result = await authService.verifyLoginOtp(mobileNumber, otp);
    
    // Log audit
    await auditService.log(result.user.id, 'LOGIN_OTP', 'User', result.user.id);
    
    sendSuccess(res, result, 'Logged in successfully');
  },

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await authService.loginWithPassword(email, password);
    
    // Log audit
    await auditService.log(result.user.id, 'LOGIN_PASSWORD', 'User', result.user.id);
    
    sendSuccess(res, result, 'Logged in successfully');
  },

  async logout(req: AuthRequest, res: Response) {
    if (req.user) {
      await auditService.log(req.user.userId, 'LOGOUT', 'User', req.user.userId);
    }
    sendSuccess(res, null, 'Logged out successfully');
  },

  async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken(refreshToken);
    sendSuccess(res, result, 'Token refreshed successfully');
  },

  async getProfile(req: AuthRequest, res: Response) {
    const profile = await authService.getUserProfile(req.user!.userId);
    sendSuccess(res, profile, 'Profile retrieved successfully');
  },
};

export default authController;
