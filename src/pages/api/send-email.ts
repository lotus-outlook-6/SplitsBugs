import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import {
  getWelcomeEmailTemplate,
  getNewDeviceLoginAlertTemplate,
  getGroupInviteNotificationTemplate,
  getAccountDeletionWarningTemplate
} from '../../utils/emailTemplates';

// Vercel handles injecting the environment variable from its settings
const resend = new Resend(process.env.RESEND_API_KEY || import.meta.env.RESEND_API_KEY);

export const prerender = false; // Forces this route to run on the server

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { to, subject, templateId, templateData } = data;

    if (!to || !subject || !templateId || !templateData) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let html = '';
    if (templateId === 'welcome') {
      html = getWelcomeEmailTemplate(templateData.userName);
    } else if (templateId === 'new-device') {
      html = getNewDeviceLoginAlertTemplate(templateData.userName, templateData.deviceInfo, templateData.time);
    } else if (templateId === 'group-invite') {
      html = getGroupInviteNotificationTemplate(templateData.userName, templateData.inviterName, templateData.groupName);
    } else if (templateId === 'account-deletion') {
      html = getAccountDeletionWarningTemplate(templateData.userName);
    } else {
      return new Response(JSON.stringify({ error: 'Invalid template ID' }), { status: 400 });
    }

    // Default "from" address for testing (Resend allows onboarding@resend.dev for verified accounts)
    const from = process.env.RESEND_FROM_EMAIL || import.meta.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    const resendResponse = await resend.emails.send({
      from,
      to,
      subject,
      html
    });

    if (resendResponse.error) {
      console.error('Resend Error:', resendResponse.error);
      return new Response(JSON.stringify({ error: resendResponse.error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true, data: resendResponse.data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
