import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthMailService {
  private readonly logger = new Logger(AuthMailService.name);

  async sendPasswordOtp(email: string, otp: string): Promise<void> {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || 'Portfolio CMS <no-reply@portfolio.local>';

    if (!host || !user || !pass) {
      this.logger.warn(
        `SMTP is not configured. Password reset OTP for ${email}: ${otp}`,
      );
      return;
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from,
      to: email,
      subject: 'Your Portfolio CMS password reset code',
      text: `Your password reset OTP is ${otp}. It expires in 10 minutes.`,
      html: `
        <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#111827">
          <h2>Password reset request</h2>
          <p>Use this one-time code to reset your Portfolio CMS password.</p>
          <p style="font-size:28px;font-weight:700;letter-spacing:8px">${otp}</p>
          <p>This code expires in 10 minutes. If you did not request it, ignore this email.</p>
        </div>
      `,
    });
  }
}
