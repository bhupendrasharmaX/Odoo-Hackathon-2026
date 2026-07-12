import type { Response } from 'express';
import { notificationService } from '../services/index.js';
import { sendSuccess } from '../utils/response.js';
import type { AuthRequest } from '../types/index.js';

export const notificationController = {
  async getAll(req: AuthRequest, res: Response) {
    const list = await notificationService.getAll();
    sendSuccess(res, list, 'Notifications list retrieved');
  },

  async markAllAsRead(req: AuthRequest, res: Response) {
    await notificationService.markAllAsRead();
    sendSuccess(res, null, 'All notifications marked as read');
  },

  async markAsRead(req: AuthRequest, res: Response) {
    const id = req.params.id as string;
    const updated = await notificationService.markAsRead(id);
    sendSuccess(res, updated, 'Notification marked as read');
  },
};

export default notificationController;
