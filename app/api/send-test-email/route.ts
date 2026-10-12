export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import sql, { initDb } from '@/lib/db';
import { sendLeadAlert } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const body = await req.json().catch(() => ({}));
    const { enquiryId, customRecipient } = body;

    let leadData: any = null;

    if (enquiryId) {
      // Re-dispatch an existing enquiry
      const rows = await sql`SELECT * FROM techsol_enquiries WHERE id = ${enquiryId} LIMIT 1`;
      if (rows && rows.length > 0) {
        leadData = rows[0];
      }
    }

    if (!leadData) {
      // Create a test lead
      leadData = {
        id: `test_${Date.now()}`,
        type: 'contact',
        client_name: '[ADMIN TEST] Techsol Connectivity Check',
        client_phone: '9851218867',
        client_email: customRecipient || 'contact@techsol.com.np',
        client_address: 'Biratnagar-5 / Kathmandu',
        industry: 'Beverages & Food Flavours',
        inquiry_type_or_model: 'Diagnostic System Test',
        description: 'This is a live diagnostic verification email dispatched to confirm delivery to contact@techsol.com.np.',
        created_at: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' })
      };
    }

    const result = await sendLeadAlert({
      id: leadData.id,
      type: leadData.type || 'contact',
      client_name: leadData.client_name,
      client_phone: leadData.client_phone || '',
      client_email: leadData.client_email || '',
      client_address: leadData.client_address || '',
      industry: leadData.industry || 'Testing',
      inquiry_type_or_model: leadData.inquiry_type_or_model || 'System Check',
      description: leadData.description || 'Test Message',
      created_at: leadData.created_at ? new Date(leadData.created_at).toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' }) : undefined,
    });

    if (enquiryId) {
      const statusText = result.success
        ? `Sent (${result.method}) to ${result.recipient}`
        : `Delivery pending: ${result.message}`;
      await sql`
        UPDATE techsol_enquiries 
        SET email_status = ${statusText}
        WHERE id = ${enquiryId}
      `;
    }

    return NextResponse.json({
      success: result.success,
      result,
    });
  } catch (error: any) {
    console.error('Test email route error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
