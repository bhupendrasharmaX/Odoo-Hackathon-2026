import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';

class Mailer {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_SECURE,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });
    }
  }

  async sendMail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      if (!this.transporter) {
        logger.info(`[MAILER SIMULATION] Sending Email to ${to} | Subject: ${subject}`);
        console.log(`\n==================================================`);
        console.log(`[EMAIL SEND] To: ${to} | Subject: ${subject}`);
        console.log(`[HTML Body]:\n${html}`);
        console.log(`==================================================\n`);
        return true;
      }

      const info = await this.transporter.sendMail({
        from: env.SMTP_FROM,
        to,
        subject,
        html,
      });

      logger.info(`Email sent successfully: ${info.messageId}`);
      return true;
    } catch (error) {
      logger.error('Failed to send email:', error);
      return false;
    }
  }
}

export const mailer = new Mailer();
export default mailer;
