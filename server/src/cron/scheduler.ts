import cron from 'node-cron';
import prisma from '../config/database.js';
import mailer from '../mail/mailer.js';
import { getLicenseExpiryTemplate, getInsuranceExpiryTemplate } from '../mail/templates.js';
import logger from '../utils/logger.js';

export function startCronJobs() {
  logger.info('⏰ Initializing background cron jobs...');

  // 1. Daily at 8 AM: Check driver license expiry (within 30 days)
  cron.schedule('0 8 * * *', async () => {
    logger.info('[CRON] Checking driver license expiries...');
    try {
      const limitDate = new Date();
      limitDate.setDate(limitDate.getDate() + 30);

      const expiringDrivers = await prisma.driver.findMany({
        where: {
          licenseExpiry: {
            gte: new Date(),
            lte: limitDate,
          },
          status: { not: 'SUSPENDED' },
        },
      });

      for (const driver of expiringDrivers) {
        const title = `License Expiring Soon: ${driver.name}`;
        const message = `License ${driver.licenseNumber} of category ${driver.licenseCategory} expires on ${driver.licenseExpiry.toISOString().split('T')[0]}.`;
        
        // Save notification in database
        await prisma.notification.create({
          data: {
            title,
            message,
            type: 'WARNING',
          },
        });

        // Send email alert to safety officer if driver has email or fallback email
        const officerEmail = process.env.SMTP_USER || 'safety@transitops.com';
        const htmlContent = getLicenseExpiryTemplate(
          driver.name,
          driver.licenseNumber,
          driver.licenseExpiry.toISOString().split('T')[0]
        );
        await mailer.sendMail(officerEmail, title, htmlContent);
      }
      logger.info(`[CRON] Processed ${expiringDrivers.length} expiring driver licenses.`);
    } catch (err) {
      logger.error('[CRON] Error during driver license check', err);
    }
  });

  // 2. Daily at 8 AM: Check vehicle insurance expiry (within 30 days)
  cron.schedule('0 8 * * *', async () => {
    logger.info('[CRON] Checking vehicle insurance expiries...');
    try {
      const limitDate = new Date();
      limitDate.setDate(limitDate.getDate() + 30);

      const expiringVehicles = await prisma.vehicle.findMany({
        where: {
          insuranceExpiry: {
            gte: new Date(),
            lte: limitDate,
          },
          status: { not: 'RETIRED' },
        },
      });

      for (const v of expiringVehicles) {
        const title = `Insurance Expiry Alert: ${v.id}`;
        const message = `Vehicle ${v.vehicleName} (${v.registrationNumber}) insurance is expiring on ${v.insuranceExpiry?.toISOString().split('T')[0]}.`;

        await prisma.notification.create({
          data: {
            title,
            message,
            type: 'WARNING',
          },
        });

        const fleetManagerEmail = process.env.SMTP_USER || 'fleet@transitops.com';
        const htmlContent = getInsuranceExpiryTemplate(
          v.registrationNumber,
          v.vehicleName,
          v.insuranceExpiry?.toISOString().split('T')[0] || ''
        );
        await mailer.sendMail(fleetManagerEmail, title, htmlContent);
      }
      logger.info(`[CRON] Processed ${expiringVehicles.length} expiring vehicle insurances.`);
    } catch (err) {
      logger.error('[CRON] Error during vehicle insurance check', err);
    }
  });

  // 3. Daily at 9 AM: Check overdue maintenance
  cron.schedule('0 9 * * *', async () => {
    logger.info('[CRON] Checking overdue maintenance logs...');
    try {
      const overdueLogs = await prisma.maintenanceLog.findMany({
        where: {
          status: 'SCHEDULED',
          startDate: { lt: new Date() },
        },
      });

      for (const log of overdueLogs) {
        // Update to OVERDUE status
        await prisma.maintenanceLog.update({
          where: { id: log.id },
          data: { status: 'OVERDUE' },
        });

        // Add Notification
        await prisma.notification.create({
          data: {
            title: `Overdue Maintenance: ${log.title}`,
            message: `Service order ${log.id} for vehicle ${log.vehicleId} was scheduled on ${log.startDate.toISOString().split('T')[0]} and is now overdue.`,
            type: 'ALERT',
          },
        });
      }
      logger.info(`[CRON] Processed ${overdueLogs.length} overdue maintenance logs.`);
    } catch (err) {
      logger.error('[CRON] Error during maintenance check', err);
    }
  });
}
