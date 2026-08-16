import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import {
  getWelcomeEmailTemplate,
  getNewDeviceLoginAlertTemplate,
  getGroupInviteNotificationTemplate,
  getAccountDeletionWarningTemplate,
  getOtpVerificationTemplate,
  getGeneralNotificationEmailTemplate
} from '../../utils/emailTemplates';

// Helper to safely get env vars in Node/Vercel or Astro
const getEnvVar = (key: string) => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) return process.env[key];
  if (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env as any)[key]) return (import.meta.env as any)[key];
  return undefined;
};



export const prerender = false; // Forces this route to run on the server

export const POST: APIRoute = async ({ request }) => {
  try {
    const smtpEmail = getEnvVar('SMTP_EMAIL');
    const smtpPass = getEnvVar('SMTP_PASSWORD');
    
    // Graceful fallback for missing local credentials
    if (!smtpEmail || !smtpPass) {
      console.warn('⚠️ SMTP credentials not found in environment variables. Email dispatch bypassed in development.');
      return new Response(JSON.stringify({ success: true, messageId: 'mock-bypassed-no-credentials' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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
    } else if (templateId === 'general') {
      html = getGeneralNotificationEmailTemplate(templateData.title || subject, templateData.message || '', templateData.actionUrl);
    } else {
      return new Response(JSON.stringify({ error: 'Invalid template ID' }), { status: 400 });
    }

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
