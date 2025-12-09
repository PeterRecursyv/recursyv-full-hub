import { describe, it, expect } from 'vitest';
import { sendEmail } from './email-service';

describe('Email Service', () => {
  it('should send test email successfully', async () => {
    const result = await sendEmail({
      to: 'recursyv@gmail.com',
      subject: 'Test Email - Recursyv Full Hub',
      html: '<h1>Test Email</h1><p>This is a test email to verify SMTP credentials are working correctly.</p>',
    });

    expect(result).toBe(true);
  }, 30000); // 30 second timeout for email sending
});
