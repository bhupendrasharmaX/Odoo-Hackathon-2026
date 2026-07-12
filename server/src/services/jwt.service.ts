import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { AuthPayload } from '../types/index.js';

export const jwtService = {
  generateAccessToken(payload: AuthPayload): string {
    const options: SignOptions = {
      expiresIn: env.JWT_ACCESS_EXPIRY as any,
    };
    return jwt.sign(payload as object, env.JWT_SECRET, options);
  },

  generateRefreshToken(payload: { userId: string }): string {
    const options: SignOptions = {
      expiresIn: env.JWT_REFRESH_EXPIRY as any,
    };
    return jwt.sign(payload as object, env.JWT_REFRESH_SECRET, options);
  },

  verifyAccessToken(token: string): AuthPayload {
    return jwt.verify(token, env.JWT_SECRET) as AuthPayload;
  },

  verifyRefreshToken(token: string): { userId: string } {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string };
  },
};

export default jwtService;
