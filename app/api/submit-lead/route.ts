import { NextRequest, NextResponse } from 'next/server';
import sql, { initDb } from '@/lib/db';

interface LeadRecord {
  id: string;
  type: 'product' | 'contact' | 'chat';
  client_name: string;
  client_phone: string;
  client_address: string;
  industry: string;
  inquiry_type_or_model: string;
  description: string;
  session_chat_history: string;
  created_at: string;
}

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const body = await req.json();

    // Check if the request is a batch synchronization trigger
    if (body.batchSync) {
      const { leads, spreadsheetId, accessToken } = body;
      
      if (!spreadsheetId || !accessToken) {
        return NextResponse.json({ error: 'Spreadsheet ID and access token required for batch sync.' }, { status: 400 });
      }

      // Sync each unsynced lead to Google Sheets
      const syncPromises = leads.map(async (l: any) => {
        try {
          await appendToGoogleSheets(spreadsheetId, accessToken, l);
          // Mark as synced in Neon PostgreSQL
          await sql`
            UPDATE techsol_enquiries 
            SET session_chat_history = 'synced'
            WHERE id = ${l.id}
          `;
          return { id: l.id, status: 'synced' };
        } catch (err) {
          console.error(`Sync failed for lead ${l.id}:`, err);
          return { id: l.id, status: 'failed' };
        }
      });

      const syncResult = await Promise.all(syncPromises);
      return NextResponse.json({ message: 'Batch sync complete', results: syncResult });
    }

    // Single Lead / Enquiry Submission
    const { 
      type = 'contact', 
      name, 
      phone, 
      address, 
      industry, 
      machineInquiry, 
      description, 
      chatHistory = '',
      spreadsheetId, 
      accessToken, 
      recipientEmail 
    } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required to write an enquiry.' }, { status: 400 });
    }

    const leadId = `enq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const formattedDate = new Date();

    // Statically save to Neon PostgreSQL database!
    await sql`
      INSERT INTO techsol_enquiries (
        id, 
        type, 
        client_name, 
        client_phone, 
        client_address, 
        industry, 
        inquiry_type_or_model, 
        description, 
        session_chat_history,
        created_at
      ) VALUES (
        ${leadId},
        ${type},
        ${name.trim()},
        ${phone ? phone.trim() : ''},
        ${address ? address.trim() : ''},
        ${industry || 'Other'},
        ${machineInquiry || 'General Inquiry'},
        ${description || ''},
        ${chatHistory ? JSON.stringify(chatHistory) : ''},
        ${formattedDate}
      )
    `;

    // 1. Google Sheets sync via REST API
    let isSynced = false;
    if (spreadsheetId && accessToken) {
      try {
        await appendToGoogleSheets(spreadsheetId, accessToken, {
          client_name: name,
          client_phone: phone || '',
          client_address: address || '',
          industry: industry || 'Other',
          inquiry_type_or_model: machineInquiry || 'General Detail',
          created_at: formattedDate.toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' })
        });
        isSynced = true;
        
        // Update synchronized state in db
        await sql`
          UPDATE techsol_enquiries 
          SET session_chat_history = 'synced'
          WHERE id = ${leadId}
        `;
      } catch (sheetError) {
        console.error('Error auto-syncing single lead to Google Sheets:', sheetError);
      }
    }

    // 2. Gmail SMTP alerting via REST API
    if (recipientEmail && accessToken) {
      try {
        await sendGmailNotification(recipientEmail, accessToken, {
          client_name: name,
          client_phone: phone || '',
          client_address: address || '',
          industry: industry || 'Other',
          inquiry_type_or_model: machineInquiry || 'General Detail',
          description: description || '',
          type,
          created_at: formattedDate.toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' })
        });
      } catch (gmailError) {
        console.error('Error sending alert via Gmail API:', gmailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Enquiry logs saved successfully',
      id: leadId,
      synced: isSynced
    });

  } catch (error: any) {
    console.error('Lead Submission Handler Error:', error);
    return NextResponse.json({ error: 'An unexpected processing error occurred at the gateway: ' + error.message }, { status: 500 });
  }
}

// REST helper to append a row of values to a Google Sheet
async function appendToGoogleSheets(spreadsheetId: string, accessToken: string, lead: any) {
  const range = 'Sheet1!A:F';
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;

  const values = [
    [lead.client_name, lead.client_phone, lead.client_address, lead.industry, lead.inquiry_type_or_model, lead.created_at]
  ];

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values }),
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Google Sheets Append failed: ${response.statusText} - ${errorDetails}`);
  }
  
  return await response.json();
}

// REST helper to send an RFC822 compliant mail via Gmail API to multiple recipients
async function sendGmailNotification(recipientEmails: string, accessToken: string, lead: any) {
  const url = 'https://gmail.googleapis.com/v1/users/me/messages/send';

  // Support multiple emails separated by commas (,)
  const alertSubject = `[Techsol Alert] ${lead.type.toUpperCase()} Enquiry from ${lead.client_name}`;
  
  // Clean comma-separated recipients list
  const emailsList = recipientEmails.split(',').map(e => e.trim()).filter(Boolean);

  for (const email of emailsList) {
    const mailBody = 
      `To: ${email}\r\n` +
      `Subject: ${alertSubject}\r\n` +
      `Content-Type: text/plain; charset="UTF-8"\r\n\r\n` +
      `Techsol International Lead / Alert Logged:\r\n` +
      `--------------------------------------------------\r\n` +
      `Enquiry Category      : ${lead.type.toUpperCase()}\r\n` +
      `Client Name           : ${lead.client_name}\r\n` +
      `Contact Phone         : ${lead.client_phone || 'N/A'}\r\n` +
      `Office/Site Location  : ${lead.client_address || 'N/A'}\r\n` +
      `Industry/Domain       : ${lead.industry}\r\n` +
      `Subject / Inquired    : ${lead.inquiry_type_or_model}\r\n` +
      `System Logged On      : ${lead.created_at}\r\n` +
      `--------------------------------------------------\r\n` +
      `Detailed Inquiries & Specification notes:\r\n` +
      `${lead.description || 'No custom description provided.'}\r\n\r\n` +
      `Automated Action Items :\r\n` +
      `- Cross-verify site layout constraints.\r\n` +
      `- Respond to customer via registered phone: ${lead.client_phone || 'N/A'}.\r\n`;

    const encodedMail = Buffer.from(mailBody)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: encodedMail }),
    });

    if (!response.ok) {
      console.error(`Gmail Send failed for recipient ${email}`);
    }
  }
}
