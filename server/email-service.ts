import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

// Email configuration from environment variables
const SMTP_USER = process.env.SMTP_USER || 'recursyv@gmail.com';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_TO = process.env.SMTP_TO || 'recursyv@gmail.com';

// Create reusable transporter
let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }
  return transporter;
}

export interface EmailOptions {
  to?: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email using Gmail SMTP
 * @param options Email options (to, subject, html, text)
 * @returns Promise<boolean> - true if sent successfully, false otherwise
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!SMTP_PASS) {
      console.warn('[Email] SMTP_PASS not configured, email not sent');
      return false;
    }

    const mailOptions = {
      from: `"Recursyv Full Hub" <${SMTP_USER}>`,
      to: options.to || SMTP_TO,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    };

    const info = await getTransporter().sendMail(mailOptions);
    console.log('[Email] Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('[Email] Error sending email:', error);
    return false;
  }
}

/**
 * Send integration request notification email
 */
export async function sendIntegrationRequestEmail(data: {
  vendorName: string;
  category: string;
  useCase: string;
  email: string;
}): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">New Integration Request</h2>
      <p>A new integration request has been submitted:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #f3f4f6;">
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Vendor Name:</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">${data.vendorName}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Category:</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">${data.category}</td>
        </tr>
        <tr style="background-color: #f3f4f6;">
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Use Case:</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">${data.useCase}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Customer Email:</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">${data.email}</td>
        </tr>
      </table>
      
      <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
        This is an automated notification from Recursyv Full Hub.
      </p>
    </div>
  `;

  return sendEmail({
    subject: `New Integration Request: ${data.vendorName}`,
    html,
  });
}

/**
 * Send purchase step notification email
 */
export async function sendPurchaseStepEmail(data: {
  purchaseId: string;
  step: number;
  stepData: any;
}): Promise<boolean> {
  const stepTitles = {
    1: 'Contact Information',
    2: 'Data Types Selection',
    3: 'Pricing Plan Selection',
    4: 'Terms Acceptance',
    5: 'Payment Completion',
  };

  const stepTitle = stepTitles[data.step as keyof typeof stepTitles] || `Step ${data.step}`;

  // Build data rows
  let dataRows = '';
  for (const [key, value] of Object.entries(data.stepData)) {
    const displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    let displayValue = value;
    
    // Format arrays
    if (Array.isArray(value)) {
      displayValue = value.join(', ');
    }
    // Format dates
    else if (value instanceof Date) {
      displayValue = value.toLocaleString();
    }
    // Format objects
    else if (typeof value === 'object' && value !== null) {
      displayValue = JSON.stringify(value, null, 2);
    }

    dataRows += `
      <tr ${dataRows ? '' : 'style="background-color: #f3f4f6;"'}>
        <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">${displayKey}:</td>
        <td style="padding: 12px; border: 1px solid #e5e7eb;">${displayValue}</td>
      </tr>
    `;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Purchase Flow - ${stepTitle}</h2>
      <p><strong>Purchase ID:</strong> ${data.purchaseId}</p>
      <p><strong>Step:</strong> ${data.step} of 5</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        ${dataRows}
      </table>
      
      <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
        This is an automated notification from Recursyv Full Hub.
      </p>
    </div>
  `;

  return sendEmail({
    subject: `Purchase ${data.purchaseId} - ${stepTitle}`,
    html,
  });
}
