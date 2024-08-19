import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';

/**
 * Service for sending emails.
 */
@Injectable()
export class MailerService {
  constructor(private readonly mailerService: NestMailerService) {}

  /**
   * Send a formatted email containing a password reset link.
   *
   * @param {string} email - The address to send the email to.
   * @param {string} token - The token string needed to later verify request.
   */
  async sendPasswordResetLink(email: string, token: string) {
    // The frontend URL which allows user to enter new password
    // TODO: update with next.js frontend url
    const url = `http://frontend-url.com/reset-password?token=${token}`;

    // Plaintext version of email for accessibility/fallback
    const textContent = `
    Dear the Venerable ${email},
    
    Please follow the link below to reset your password:
    
    ${url}
    
    Note: for security reasons this link is only valid for one hour.
    
    If you did not request this email you can safely ignore it.
  `;

    // Rich HTML version of email
    const htmlContent = `
    <html>
      <head>
        <title>Password Reset Request</title>
      </head>
      <body>
        <div>
          <p>Dear the Venerable ${email},</p>
          <p>Please follow the link below to reset your password:</p>
          <p>
            <a href='${url}'>Reset</a>
          </p>
          <p>Note: for security reasons this link is only valid for one hour.</p>
          <p>If you did not request this email you can safely ignore it.</p>
        </div>
      </body>
    </html>
  `;

    // Send the email via SMTP
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset Request 🔐',
      text: textContent,
      html: htmlContent,
      // template: './password-reset',
      // context: {
      //   email,
      //   url,
      // },
    });
  }
}
