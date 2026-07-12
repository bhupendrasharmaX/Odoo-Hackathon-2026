import type { Response } from 'express';
import { reportService } from '../services/index.js';
import { sendSuccess } from '../utils/response.js';
import type { AuthRequest } from '../types/index.js';

export const reportController = {
  async getDashboard(req: AuthRequest, res: Response) {
    const stats = await reportService.getDashboardStats();
    const charts = await reportService.getAnalyticsData();
    
    // Send structure matching frontend chartData + dashboardStats combined or individually
    sendSuccess(res, { stats, charts }, 'Dashboard metrics retrieved');
  },

  async getFleetReport(req: AuthRequest, res: Response) {
    const report = await reportService.getFleetReport();
    sendSuccess(res, report, 'Fleet analytics report retrieved');
  },

  async exportCSV(req: AuthRequest, res: Response) {
    const report = await reportService.getFleetReport();
    const csv = await reportService.generateCSVReport(report);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=fleet_report.csv');
    res.status(200).send(csv);
  },

  async exportPDF(req: AuthRequest, res: Response) {
    // Basic PDF mock response or printable HTML view
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=fleet_report.pdf');
    res.status(200).send(Buffer.from('%PDF-1.4 Mock PDF Data for Hackathon Demonstration'));
  },
};

export default reportController;
