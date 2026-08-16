import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

// Helper to safely get env vars in Node/Vercel or Astro
const getEnvVar = (key: string) => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) return process.env[key];
  if (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env as any)[key]) return (import.meta.env as any)[key];
  return undefined;
};



export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const smtpEmail = getEnvVar('SMTP_EMAIL');
    const smtpPass = getEnvVar('SMTP_PASSWORD');
    
    // Graceful fallback for missing local credentials
    if (!smtpEmail || !smtpPass) {
      console.warn('⚠️ SMTP credentials not found in environment variables. Account data email dispatch bypassed in development.');
      return new Response(JSON.stringify({ success: true, messageId: 'mock-bypassed-no-credentials' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await request.json();
    const { to, userData, userGroups, allExpenses, notifications } = data;

    if (!to) {
      return new Response(JSON.stringify({ error: 'Missing recipient email' }), { status: 400 });
    }

    const userName = userData?.name || to.split('@')[0];
    const userAvatar = userData?.photoURL || userData?.avatar || 'Not provided';
    const createdAt = userData?.createdAt ? new Date(userData.createdAt).toLocaleString() : 'N/A';
    const defaultCurrency = userData?.currency || 'USD ($)';

    // Build CSV Content
    let csvRows = ['Category,Group,Title,Amount,PaidBy,Date,SplitDetails'];
    (allExpenses || []).forEach((exp: any) => {
      const title = `"${(exp.title || exp.name || 'Expense').replace(/"/g, '""')}"`;
      const group = `"${(exp.groupName || 'Group').replace(/"/g, '""')}"`;
      const cat = exp.category || 'General';
      const amt = `${exp.currency || '$'}${exp.amount || 0}`;
      const paidBy = exp.paidBy || 'Unknown';
      const date = exp.createdAt ? new Date(exp.createdAt).toLocaleDateString() : 'N/A';
      const splits = exp.splitBetween ? `"${JSON.stringify(exp.splitBetween).replace(/"/g, '""')}"` : 'Equal';
      csvRows.push(`${cat},${group},${title},${amt},${paidBy},${date},${splits}`);
    });
    const csvContent = csvRows.join('\n');

    // Build Groups HTML list
    const groupsHtml = (userGroups || []).map((g: any) => `
      <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:12px 16px; border-radius:12px; margin-bottom:10px;">
        <div style="font-weight:bold; font-size:14px; color:#1e293b;">${g.name || 'Unnamed Group'}</div>
        <div style="font-size:12px; color:#64748b; margin-top:4px;">
          Default Currency: <strong>${g.currency || 'USD'}</strong> | Created By: <strong>${g.createdBy || 'Unknown'}</strong>
        </div>
        <div style="font-size:12px; color:#64748b; margin-top:2px;">
          Members (${(g.members || []).length}): ${(g.members || []).join(', ')}
        </div>
      </div>
    `).join('');

    // Build Email HTML Report
    const htmlReport = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; }
          .card { background-color: #ffffff; max-width: 640px; margin: 0 auto; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0; }
          .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; padding: 32px 24px; text-align: center; }
          .content { padding: 32px 24px; color: #334155; }
          .section-title { font-size: 16px; font-weight: bold; color: #0f172a; margin-top: 24px; margin-bottom: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; }
          .stat-grid { display: table; width: 100%; margin-bottom: 20px; }
          .stat-box { display: table-cell; width: 33%; background: #f8fafc; padding: 12px; border-radius: 10px; text-align: center; border: 1px solid #e2e8f0; }
          .stat-val { font-size: 18px; font-weight: bold; color: #4f46e5; }
          .stat-lbl { font-size: 11px; color: #64748b; margin-top: 2px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; background: #f8fafc; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">SplitsBug Account Data Export</h1>
            <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">Complete Archive for ${userName}</p>
          </div>
          <div class="content">
            <p style="font-size: 14px; line-height: 1.5; color: #475569;">
              Here is your complete personal data archive compiled from SplitsBug. Attached to this email is your structured CSV export file (<code>SplitsBug_Account_Data.csv</code>) compatible with Excel, Google Sheets, and Notion.
            </p>

            <div class="stat-grid">
              <div class="stat-box">
                <div class="stat-val">${(userGroups || []).length}</div>
                <div class="stat-lbl">Total Groups</div>
              </div>
              <div class="stat-box">
                <div class="stat-val">${(allExpenses || []).length}</div>
                <div class="stat-lbl">Expenses Recorded</div>
              </div>
              <div class="stat-box">
                <div class="stat-val">${(notifications || []).length}</div>
                <div class="stat-lbl">Notifications</div>
              </div>
            </div>

            <div class="section-title">👤 User Profile Details</div>
            <p style="font-size: 13px; line-height: 1.6;">
              <strong>Full Name:</strong> ${userName}<br>
              <strong>Email Address:</strong> ${to}<br>
              <strong>Profile Photo URL:</strong> <a href="${userAvatar}">${userAvatar}</a><br>
              <strong>Default Currency:</strong> ${defaultCurrency}<br>
              <strong>Account Created:</strong> ${createdAt}
            </p>

            <div class="section-title">👥 Group Memberships (${(userGroups || []).length})</div>
            ${groupsHtml || '<p style="font-size:13px; color:#94a3b8;">No groups recorded.</p>'}

            <div class="section-title">📊 Expense History Summary</div>
            <p style="font-size: 13px; color: #475569;">
              You have a total of <strong>${(allExpenses || []).length}</strong> expenses recorded across your groups. Please inspect the attached <code>SplitsBug_Account_Data.csv</code> for itemized amounts, currencies, splits, and date timestamps.
            </p>
          </div>
          <div class="footer">
            SplitsBug Security & Privacy Team &bull; <a href="https://splitsbug.app" style="color: #4f46e5; text-decoration: none;">splitsbug.app</a>
          </div>
        </div>
      </body>
      </html>
    `;

    const from = getEnvVar('SMTP_EMAIL');

    // Setup Nodemailer transporter inside handler to catch any init errors
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: smtpEmail,
        pass: smtpPass,
      }
    });

    const info = await transporter.sendMail({
      from: `"SplitsBug Data Archive" <${from}>`,
      to,
      subject: `Your SplitsBug Complete Account Data Export (${userName})`,
      html: htmlReport,
      attachments: [
        {
          filename: `SplitsBug_Account_Data_${userName.replace(/[^a-zA-Z0-9]/g, '_')}.csv`,
          content: csvContent,
          contentType: 'text/csv'
        }
      ]
    });

    return new Response(JSON.stringify({ success: true, messageId: info.messageId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Data Export API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
