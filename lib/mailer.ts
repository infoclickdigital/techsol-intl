import nodemailer from 'nodemailer';
import sql from '@/lib/db';

export interface LeadNotificationData {
  id?: string;
  type: string;
  client_name: string;
  client_phone: string;
  client_email?: string;
  client_address: string;
  industry: string;
  inquiry_type_or_model: string;
  description: string;
  created_at?: string;
  accessToken?: string | null;
}

export interface MailDispatchResult {
  success: boolean;
  method: string;
  message: string;
  recipient: string;
  logs: string[];
}

/**
 * Robust, multi-tiered mailer for Techsol International.
 * Sends inward client enquiries directly to contact@techsol.com.np.
 *
 * Tier 1: Direct SMTP via Nodemailer (if SMTP credentials are provided in DB config or ENV)
 * Tier 2: Resend API (if RESEND_API_KEY is configured)
 * Tier 3: FormSubmit REST Gateway (automated forwarding to contact@techsol.com.np)
 * Tier 4: Google Workspace Gmail API (if OAuth token is present)
 */
export async function sendLeadAlert(lead: LeadNotificationData): Promise<MailDispatchResult> {
  const logs: string[] = [];
  logs.push(`Initiating email dispatch for lead: "${lead.client_name}" (${lead.type})`);

  // 1. Fetch system email configuration from Neon PostgreSQL
  let recipientEmail = 'contact@techsol.com.np';
  let smtpHost = process.env.SMTP_HOST || '';
  let smtpPort = Number(process.env.SMTP_PORT) || 587;
  let smtpUser = process.env.SMTP_USER || '';
  let smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD || '';
  let smtpFrom = process.env.SMTP_FROM || 'Techsol Alerts <contact@techsol.com.np>';
  let smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;
  let resendApiKey = process.env.RESEND_API_KEY || '';

  try {
    const configRows = await sql`SELECT key, value FROM techsol_config`;
    for (const row of configRows) {
      if (row.key === 'recipient_emails' && row.value?.trim()) recipientEmail = row.value.trim();
      if (row.key === 'smtp_host' && row.value?.trim()) smtpHost = row.value.trim();
      if (row.key === 'smtp_port' && row.value?.trim()) smtpPort = Number(row.value.trim()) || 587;
      if (row.key === 'smtp_user' && row.value?.trim()) smtpUser = row.value.trim();
      if (row.key === 'smtp_pass' && row.value?.trim()) smtpPass = row.value.trim();
      if (row.key === 'smtp_from' && row.value?.trim()) smtpFrom = row.value.trim();
      if (row.key === 'smtp_secure') smtpSecure = row.value === 'true' || smtpPort === 465;
      if (row.key === 'resend_api_key' && row.value?.trim()) resendApiKey = row.value.trim();
    }
  } catch (err: any) {
    logs.push(`Warning: could not query techsol_config: ${err.message}`);
  }

  // Ensure recipient has contact@techsol.com.np
  if (!recipientEmail || recipientEmail.includes('info@techsol.international')) {
    recipientEmail = 'contact@techsol.com.np';
  }

  const subject = `[Techsol Alert] ${lead.type.toUpperCase()} Enquiry from ${lead.client_name} (${lead.inquiry_type_or_model})`;
  const formattedTime = lead.created_at || new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' });

  const plainText = `
TECHSOL INTERNATIONAL - INWARD CLIENT ENQUIRY LOGGED
=====================================================
Client Name            : ${lead.client_name}
Contact Phone          : ${lead.client_phone || 'N/A'}
Contact Email          : ${lead.client_email || 'N/A'}
Factory / Site Location: ${lead.client_address || 'N/A'}
Industry Sector        : ${lead.industry || 'Other'}
Product/Machine Needed : ${lead.inquiry_type_or_model || 'General Inquiry'}
Enquiry Category       : ${lead.type.toUpperCase()}
Logged Date & Time     : ${formattedTime} (Nepal Time)
=====================================================

SPECIFICATION & REQUIREMENTS NOTE:
${lead.description || 'No additional notes attached.'}

-----------------------------------------------------
Next Steps:
- Review specifications against available flavours/ingredients inventory.
- Connect with representative at: ${lead.client_phone || 'N/A'}
- Dedicated Inbox: ${recipientEmail}
`;

  const htmlBody = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
  <div style="background: #0f172a; padding: 24px; color: #ffffff;">
    <span style="font-size: 11px; font-family: monospace; letter-spacing: 2px; text-transform: uppercase; color: #f59e0b; font-weight: bold;">Techsol International Alert</span>
    <h1 style="margin: 8px 0 0 0; font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">New Inward Client Enquiry</h1>
    <p style="margin: 4px 0 0 0; font-size: 12px; color: #94a3b8;">Routed directly to ${recipientEmail}</p>
  </div>
  
  <div style="padding: 24px; color: #334155; line-height: 1.6;">
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; color: #64748b; font-weight: 600; width: 160px;">Client Name</td>
        <td style="padding: 10px 0; color: #0f172a; font-weight: 700; font-size: 15px;">${lead.client_name}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Contact Phone</td>
        <td style="padding: 10px 0; color: #0f172a; font-weight: bold;"><a href="tel:${lead.client_phone}" style="color: #d97706; text-decoration: none;">${lead.client_phone || 'N/A'}</a></td>
      </tr>
      ${lead.client_email ? `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Client Email</td>
        <td style="padding: 10px 0; color: #0f172a;"><a href="mailto:${lead.client_email}" style="color: #d97706; text-decoration: none;">${lead.client_email}</a></td>
      </tr>` : ''}
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Office / Site Address</td>
        <td style="padding: 10px 0; color: #0f172a;">${lead.client_address || 'N/A'}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Industry Domain</td>
        <td style="padding: 10px 0; color: #0f172a;">${lead.industry || 'Other'}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Product / Machine Needed</td>
        <td style="padding: 10px 0; color: #0f172a;"><span style="background: #fef3c7; color: #92400e; padding: 3px 8px; border-radius: 4px; font-weight: 700; font-size: 11px;">${lead.inquiry_type_or_model || 'General Inquiry'}</span></td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Enquiry Channel</td>
        <td style="padding: 10px 0; color: #0f172a; text-transform: uppercase; font-family: monospace; font-size: 11px;">${lead.type}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Logged Timestamp</td>
        <td style="padding: 10px 0; color: #64748b; font-size: 12px;">${formattedTime} (Nepal Time)</td>
      </tr>
    </table>

    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin-top: 16px;">
      <span style="font-size: 11px; font-family: monospace; text-transform: uppercase; color: #64748b; font-weight: bold; display: block; margin-bottom: 6px;">Client Specification Details</span>
      <p style="margin: 0; font-size: 13px; color: #1e293b; white-space: pre-wrap;">${lead.description || 'No direct notes attached.'}</p>
    </div>

    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9; display: flex; gap: 12px;">
      <a href="tel:${lead.client_phone}" style="display: inline-block; background: #d97706; color: #ffffff; padding: 10px 18px; border-radius: 6px; font-size: 12px; font-weight: bold; text-decoration: none; text-transform: uppercase;">Call Client (${lead.client_phone || 'N/A'})</a>
      <a href="mailto:${recipientEmail}?subject=Re: ${encodeURIComponent(subject)}" style="display: inline-block; background: #0f172a; color: #ffffff; padding: 10px 18px; border-radius: 6px; font-size: 12px; font-weight: bold; text-decoration: none; text-transform: uppercase; margin-left: 8px;">Reply via Email</a>
    </div>
  </div>
  
  <div style="background: #f8fafc; padding: 14px 24px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; font-family: monospace;">
    Techsol International • Food Flavours & Machinery Solutions • Kathmandu & Biratnagar, Nepal
  </div>
</div>
`;

  // -------------------------------------------------------------
  // METHOD 1: Direct SMTP via Nodemailer
  // -------------------------------------------------------------
  if (smtpHost && smtpUser && smtpPass) {
    logs.push(`Attempting delivery via SMTP host ${smtpHost}:${smtpPort} as ${smtpUser}...`);
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const info = await transporter.sendMail({
        from: smtpFrom || smtpUser,
        to: recipientEmail,
        subject,
        text: plainText,
        html: htmlBody,
      });

      logs.push(`SMTP delivery succeeded: MessageId ${info.messageId}`);
      return {
        success: true,
        method: 'SMTP',
        message: `Enquiry email successfully delivered to ${recipientEmail} via SMTP.`,
        recipient: recipientEmail,
        logs,
      };
    } catch (smtpErr: any) {
      logs.push(`SMTP error: ${smtpErr.message}. Proceeding to fallback dispatch...`);
      console.warn('SMTP Dispatch failed, falling back:', smtpErr);
    }
  } else {
    logs.push(`No complete SMTP credentials configured (host=${Boolean(smtpHost)}, user=${Boolean(smtpUser)}).`);
  }

  // -------------------------------------------------------------
  // METHOD 2: Resend API
  // -------------------------------------------------------------
  if (resendApiKey) {
    logs.push(`Attempting delivery via Resend API...`);
    try {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Techsol Notifications <onboarding@resend.dev>',
          to: recipientEmail.split(',').map(e => e.trim()),
          subject,
          text: plainText,
          html: htmlBody,
        }),
      });

      if (resendRes.ok) {
        const resendData = await resendRes.json();
        logs.push(`Resend delivery succeeded: ID ${resendData.id}`);
        return {
          success: true,
          method: 'Resend',
          message: `Enquiry email successfully delivered to ${recipientEmail} via Resend.`,
          recipient: recipientEmail,
          logs,
        };
      } else {
        const errText = await resendRes.text();
        logs.push(`Resend error: ${errText}`);
      }
    } catch (resendErr: any) {
      logs.push(`Resend API call error: ${resendErr.message}`);
    }
  }

  // -------------------------------------------------------------
  // METHOD 3: Google Gmail API (if OAuth token present)
  // -------------------------------------------------------------
  if (lead.accessToken) {
    logs.push(`Attempting delivery via Google Gmail REST API with Bearer token...`);
    try {
      const url = 'https://gmail.googleapis.com/v1/users/me/messages/send';
      const encodedMail = Buffer.from(
        `To: ${recipientEmail}\r\nSubject: ${subject}\r\nContent-Type: text/plain; charset="UTF-8"\r\n\r\n${plainText}`
      )
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const gRes = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${lead.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ raw: encodedMail }),
      });

      if (gRes.ok) {
        logs.push(`Gmail API send succeeded`);
        return {
          success: true,
          method: 'Gmail API',
          message: `Enquiry email successfully delivered to ${recipientEmail} via Gmail API.`,
          recipient: recipientEmail,
          logs,
        };
      } else {
        const gErr = await gRes.text();
        logs.push(`Gmail API response error: ${gErr}`);
      }
    } catch (gErr: any) {
      logs.push(`Gmail API error: ${gErr.message}`);
    }
  }

  // -------------------------------------------------------------
  // METHOD 4: FormSubmit REST Gateway Auto-Dispatch
  // -------------------------------------------------------------
  logs.push(`Attempting delivery via FormSubmit Gateway directly to ${recipientEmail}...`);
  try {
    const fsEndpoint = `https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`;
    const fsRes = await fetch(fsEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
        'Origin': 'https://techsol.international',
        'Referer': 'https://techsol.international/contact',
      },
      body: JSON.stringify({
        _subject: subject,
        _template: 'table',
        _captcha: 'false',
        _replyto: lead.client_email || 'noreply@techsol.international',
        'Client Name': lead.client_name,
        'Phone Number': lead.client_phone || 'N/A',
        'Address Location': lead.client_address || 'N/A',
        'Industry Domain': lead.industry || 'Other',
        'Hardware / Product Needed': lead.inquiry_type_or_model || 'General Detail',
        'Enquiry Channel': lead.type,
        'Logged At': formattedTime,
        'Requirements & Message': lead.description || 'None',
      }),
    });

    const fsData = await fsRes.json().catch(() => ({}));
    logs.push(`FormSubmit response: ${JSON.stringify(fsData)}`);

    const isOk = fsRes.ok && (fsData.success === 'true' || fsData.success === true || !('success' in fsData));

    if (isOk) {
      return {
        success: true,
        method: 'FormSubmit Gateway',
        message: `Enquiry routed to ${recipientEmail} via Gateway. (${fsData.message || 'Delivered successfully'})`,
        recipient: recipientEmail,
        logs,
      };
    } else {
      logs.push(`FormSubmit returned non-success: ${fsData.message || 'Check recipient inbox for activation link'}`);
      return {
        success: false,
        method: 'FormSubmit Gateway',
        message: fsData.message?.includes('Activation') 
          ? `FormSubmit activation required: Check ${recipientEmail} inbox to click 'Activate Form'.`
          : (fsData.message || 'Gateway dispatch rejected.'),
        recipient: recipientEmail,
        logs,
      };
    }
  } catch (fsErr: any) {
    logs.push(`FormSubmit Gateway error: ${fsErr.message}`);
  }

  return {
    success: false,
    method: 'None',
    message: `Unable to automatically dispatch to ${recipientEmail}. Enquiry safely recorded in database.`,
    recipient: recipientEmail,
    logs,
  };
}
