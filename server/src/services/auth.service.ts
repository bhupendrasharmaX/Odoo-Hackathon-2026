import { userRepository } from '../repositories/index.js';
import { otpService } from './otp.service.js';
import { jwtService } from './jwt.service.js';
import { AppError } from '../middlewares/errorHandler.js';
import type { AuthPayload } from '../types/index.js';
import bcrypt from 'bcrypt';

export const authService = {
  async sendLoginOtp(mobileNumber: string): Promise<void> {
    const user = await userRepository.findByMobile(mobileNumber);
    if (!user) {
      throw new AppError('User not registered with this mobile number', 404, 'USER_NOT_FOUND');
    }
    await otpService.sendOtp(mobileNumber, 'LOGIN');
  },

  async verifyLoginOtp(mobileNumber: string, otp: string) {
    const user = await userRepository.findByMobile(mobileNumber);
    if (!user) {
      throw new AppError('User not registered with this mobile number', 404, 'USER_NOT_FOUND');
    }

    await otpService.verifyOtp(mobileNumber, otp, 'LOGIN');

    // Update login status
    await userRepository.updateLastLogin(user.id);

    const payload: AuthPayload = {
      userId: user.id,
      roleId: user.roleId,
      roleName: user.role.name,
      permissions: user.role.permissions as string[],
    };

    const accessToken = jwtService.generateAccessToken(payload);
    const refreshToken = jwtService.generateRefreshToken({ userId: user.id });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        mobileNumber: user.mobileNumber,
        email: user.email,
        role: user.role.name,
        lastLogin: user.lastLogin,
      },
    };
  },

  async loginWithPassword(email: string, pass: string) {
    const user = await userRepository.findByEmail(email);
    if (!user || !user.password) {
      throw new AppError('Invalid credentials', 401, 'UNAUTHORIZED');
    }

    const valid = await bcrypt.compare(pass, user.password);
    if (!valid) {
      throw new AppError('Invalid credentials', 401, 'UNAUTHORIZED');
    }

    await userRepository.updateLastLogin(user.id);

    const payload: AuthPayload = {
      userId: user.id,
      roleId: user.roleId,
      roleName: user.role.name,
      permissions: user.role.permissions as string[],
    };

    const accessToken = jwtService.generateAccessToken(payload);
    const refreshToken = jwtService.generateRefreshToken({ userId: user.id });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        mobileNumber: user.mobileNumber,
        email: user.email,
        role: user.role.name,
        lastLogin: user.lastLogin,
      },
    };
  },

  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = jwtService.verifyRefreshToken(refreshToken);
      const user = await userRepository.findById(decoded.userId);

      if (!user || !user.isActive) {
        throw new AppError('User inactive or not found', 401, 'UNAUTHORIZED');
      }

      const payload: AuthPayload = {
        userId: user.id,
        roleId: user.roleId,
        roleName: user.role.name,
        permissions: user.role.permissions as string[],
      };

      const accessToken = jwtService.generateAccessToken(payload);
      return { accessToken };
    } catch {
      throw new AppError('Invalid or expired refresh token', 401, 'UNAUTHORIZED');
    }
  },

  async getUserProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User profile not found', 404, 'USER_NOT_FOUND');
    }
    return {
      id: user.id,
      name: user.name,
      mobileNumber: user.mobileNumber,
      email: user.email,
      role: user.role.name,
      isMobileVerified: user.isMobileVerified,
      lastLogin: user.lastLogin,
    };
  },
};

export default authService;
