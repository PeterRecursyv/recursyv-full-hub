import { describe, it, expect } from 'vitest';
import { sendEmail } from './email-service';

describe('Email Recipient Configuration', () => {
  it('should send email to info@recursyv.com', async () => {
    const result = await sendEmail({
      to: process.env.SMTP_TO || 'info@recursyv.com',
      subject: 'Test Email - Recipient Verification',
      html: '<h1>Recipient Test</h1><p>This email verifies that notifications are being sent to info@recursyv.com</p>',
    });

    expect(result).toBe(true);
    expect(process.env.SMTP_TO).toBe('info@recursyv.com');
  }, 30000);
});
