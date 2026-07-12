import prisma from '../config/database.js';

export const notificationService = {
  async getAll() {
    return prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  },

  async markAllAsRead() {
    return prisma.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });
  },

  async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  },
};

export default notificationService;
