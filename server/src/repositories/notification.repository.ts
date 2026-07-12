import prisma from '../config/database.js';
import type { Prisma, NotificationType } from '@prisma/client';

export const notificationRepository = {
  create(data: { title: string; message: string; type?: NotificationType }) {
    return prisma.notification.create({ data });
  },

  findAll(params: {
    skip?: number;
    take?: number;
    orderBy?: Prisma.NotificationOrderByWithRelationInput;
  }) {
    return prisma.notification.findMany(params);
  },

  count(where?: Prisma.NotificationWhereInput) {
    return prisma.notification.count({ where });
  },

  markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  },

  markAllAsRead() {
    return prisma.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });
  },

  delete(id: string) {
    return prisma.notification.delete({ where: { id } });
  },
};
