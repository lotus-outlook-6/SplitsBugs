import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import {
  getWelcomeEmailTemplate,
  getNewDeviceLoginAlertTemplate,
  getGroupInviteNotificationTemplate,
  getAccountDeletionWarningTemplate,
  getOtpVerificationTemplate
} from '../../utils/emailTemplates';

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_EMAIL || import.meta.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD || import.meta.env.SMTP_PASSWORD,
  }
});

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
    } else if (templateId === 'otp') {
      html = getOtpVerificationTemplate(templateData.code);
    } else {
      return new Response(JSON.stringify({ error: 'Invalid template ID' }), { status: 400 });
    }

    const from = process.env.SMTP_EMAIL || import.meta.env.SMTP_EMAIL;

    const info = await transporter.sendMail({
      from: `"SplitsBug" <${from}>`,
      to,
      subject,
      html
    });

    return new Response(JSON.stringify({ success: true, messageId: info.messageId }), {
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
