import prisma from '../config/database.js';
import type { OtpPurpose } from '@prisma/client';

export const otpRepository = {
  create(data: {
    mobileNumber: string;
    otpCode: string;
    purpose: OtpPurpose;
    expiresAt: Date;
  }) {
    return prisma.otpVerification.create({ data });
  },

  findLatestValid(mobileNumber: string, purpose: OtpPurpose) {
    return prisma.otpVerification.findFirst({
      where: {
        mobileNumber,
        purpose,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  markUsed(id: string) {
    return prisma.otpVerification.update({
      where: { id },
      data: { isUsed: true },
    });
  },

  incrementAttempts(id: string) {
    return prisma.otpVerification.update({
      where: { id },
      data: { attemptCount: { increment: 1 } },
    });
  },

  countRecentByMobile(mobileNumber: string, windowMs: number) {
    const since = new Date(Date.now() - windowMs);
    return prisma.otpVerification.count({
      where: {
        mobileNumber,
        createdAt: { gte: since },
      },
    });
  },

  invalidateAll(mobileNumber: string, purpose: OtpPurpose) {
    return prisma.otpVerification.updateMany({
      where: {
        mobileNumber,
        purpose,
        isUsed: false,
      },
      data: { isUsed: true },
    });
  },

  cleanup() {
    return prisma.otpVerification.deleteMany({
      where: {
        OR: [
          { isUsed: true },
          { expiresAt: { lt: new Date() } },
        ],
      },
    });
  },
};
