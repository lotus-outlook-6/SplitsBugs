// ─────────────────────────────────────────────────────────────────────────────
// SplitsBug Email Templates
// Professional, minimal design system. No emojis. White + Purple palette.
// All templates use table-based layout for maximum email client compatibility.
// ─────────────────────────────────────────────────────────────────────────────

const APP_URL = 'https://splits-bugs.vercel.app';
const LOGO_URL = 'https://splits-bugs.vercel.app/SplitBugs-Brand/logos/logo-wordmark.png';
const YEAR = new Date().getFullYear();

// Brand colors
const C = {
  brand: '#5060F0',
  ink: '#0F0F14',
  inkMid: '#454550',
  inkLight: '#8C8CA1',
  bg: '#F7F7F9',
  surface: '#FFFFFF',
  border: '#E5E5EE',
  red: '#DC2626',
  redBg: '#FEF2F2',
  redBorder: '#FECACA',
  amber: '#D97706',
  amberBg: '#FFFBEB',
  amberBorder: '#FDE68A',
};

// ─── Shared layout shells ────────────────────────────────────────────────────

function emailShell(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    * { box-sizing: border-box; }
  </style>
</head>
<body style="margin:0; padding:0; background-color:${C.bg}; font-family:'Inter', Helvetica, Arial, sans-serif; -webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.bg}; padding:48px 16px;">
    <tr>
      <td align="center">
        <!-- Card -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.surface}; border-radius:12px; border:1px solid ${C.border}; max-width:580px; width:100%;">

          <!-- Logo header -->
          <tr>
            <td style="padding:32px 40px 28px 40px; border-bottom:1px solid ${C.border};">
              <img src="${LOGO_URL}" width="140" alt="SplitsBug" style="display:block; width:140px; height:auto; border:0;">
            </td>
          </tr>

          <!-- Body injected here -->
          ${body}

          <!-- Footer -->
          <tr>
            <td style="padding:0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="border-top:1px solid ${C.border}; font-size:0; line-height:0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px 36px 40px;">
              <p style="margin:0 0 6px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:12px; line-height:18px; color:${C.inkLight};">
                SplitsBug &mdash; Split expenses, not friendships.
              </p>
              <p style="margin:0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:12px; line-height:18px; color:${C.inkLight};">
                &copy; ${YEAR} SplitsBug. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>
</body>
</html>`;
}

function primaryButton(label: string, url: string): string {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="border-radius:8px; background-color:${C.brand};">
        <a href="${url}" target="_blank"
           style="display:inline-block; padding:13px 28px; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:14px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:8px; letter-spacing:-0.1px;">
          ${label}
        </a>
      </td>
    </tr>
  </table>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Welcome Email
// ─────────────────────────────────────────────────────────────────────────────
export function getWelcomeEmailTemplate(userName: string): string {
  const body = `
          <tr>
            <td style="padding:36px 40px 0 40px;">
              <p style="margin:0 0 24px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:22px; line-height:30px; font-weight:700; color:${C.ink}; letter-spacing:-0.4px;">
                Welcome to SplitsBug, ${userName}.
              </p>
              <p style="margin:0 0 16px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:15px; line-height:24px; color:${C.inkMid};">
                Your account is ready. SplitsBug helps you track shared expenses and settle up with friends, roommates, or anyone you split costs with.
              </p>
              <p style="margin:0 0 32px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:15px; line-height:24px; color:${C.inkMid};">
                Get started by creating your first group and adding an expense.
              </p>
              ${primaryButton('Go to Dashboard', `${APP_URL}/dashboard`)}
            </td>
          </tr>

          <tr><td style="height:40px; font-size:0;">&nbsp;</td></tr>

          <tr>
            <td style="padding:0 40px 40px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${C.border}; border-radius:8px; overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px; border-bottom:1px solid ${C.border};">
                    <p style="margin:0 0 2px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:13px; font-weight:600; color:${C.ink};">Create a group</p>
                    <p style="margin:0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:13px; line-height:20px; color:${C.inkMid};">Invite friends and start tracking expenses together.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 24px; border-bottom:1px solid ${C.border};">
                    <p style="margin:0 0 2px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:13px; font-weight:600; color:${C.ink};">Add expenses</p>
                    <p style="margin:0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:13px; line-height:20px; color:${C.inkMid};">Log shared costs and let SplitsBug calculate who owes what.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 2px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:13px; font-weight:600; color:${C.ink};">Settle up</p>
                    <p style="margin:0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:13px; line-height:20px; color:${C.inkMid};">See balances at a glance and record settlements when paid.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;

  return emailShell('Welcome to SplitsBug', body);
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. New Device Login Alert
// ─────────────────────────────────────────────────────────────────────────────
export function getNewDeviceLoginAlertTemplate(userName: string, deviceInfo: string, time: string): string {
  const body = `
          <tr>
            <td style="padding:36px 40px 0 40px;">
              <p style="margin:0 0 6px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:11px; font-weight:600; color:${C.brand}; text-transform:uppercase; letter-spacing:0.8px;">Security alert</p>
              <p style="margin:0 0 24px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:22px; line-height:30px; font-weight:700; color:${C.ink}; letter-spacing:-0.4px;">
                New sign-in to your account
              </p>
              <p style="margin:0 0 28px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:15px; line-height:24px; color:${C.inkMid};">
                Hello, <strong style="color:${C.ink};">${userName}</strong>. We detected a new sign-in to your SplitsBug account.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 28px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${C.border}; border-radius:8px; overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px; border-bottom:1px solid ${C.border};">
                    <p style="margin:0 0 2px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.6px; color:${C.inkLight};">Device</p>
                    <p style="margin:0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:14px; color:${C.ink}; font-weight:500;">${deviceInfo}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 2px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.6px; color:${C.inkLight};">Time</p>
                    <p style="margin:0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:14px; color:${C.ink}; font-weight:500;">${time}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 28px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.amberBg}; border:1px solid ${C.amberBorder}; border-radius:8px;">
                <tr>
                  <td style="padding:16px 20px; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:13px; line-height:20px; color:${C.amber};">
                    <strong>Don't recognize this?</strong> If this was not you, secure your account immediately by changing your password.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 40px 40px;">
              <p style="margin:0 0 20px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:14px; line-height:22px; color:${C.inkMid};">
                If this was you, no action is needed. You can safely ignore this email.
              </p>
              ${primaryButton('Review Account Security', `${APP_URL}/account`)}
            </td>
          </tr>`;

  return emailShell('New sign-in detected &mdash; SplitsBug', body);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Group Invite Notification
// ─────────────────────────────────────────────────────────────────────────────
export function getGroupInviteNotificationTemplate(userName: string, inviterName: string, groupName: string): string {
  const body = `
          <tr>
            <td style="padding:36px 40px 0 40px;">
              <p style="margin:0 0 6px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:11px; font-weight:600; color:${C.brand}; text-transform:uppercase; letter-spacing:0.8px;">Invitation</p>
              <p style="margin:0 0 24px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:22px; line-height:30px; font-weight:700; color:${C.ink}; letter-spacing:-0.4px;">
                You have been invited to a group
              </p>
              <p style="margin:0 0 28px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:15px; line-height:24px; color:${C.inkMid};">
                Hello, <strong style="color:${C.ink};">${userName}</strong>. <strong style="color:${C.ink};">${inviterName}</strong> has invited you to join a shared expense group on SplitsBug.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 32px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${C.border}; border-radius:8px; overflow:hidden;">
                <tr>
                  <td style="padding:10px 24px; background-color:${C.brand};">
                    <p style="margin:0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.8px; color:rgba(255,255,255,0.75);">Group name</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 4px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:20px; line-height:28px; font-weight:700; color:${C.ink}; letter-spacing:-0.3px;">${groupName}</p>
                    <p style="margin:0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:13px; color:${C.inkMid};">Invited by ${inviterName}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 40px 40px;">
              <p style="margin:0 0 20px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:14px; line-height:22px; color:${C.inkMid};">
                Open SplitsBug to accept the invitation and start splitting expenses with the group.
              </p>
              ${primaryButton('View Invitation', `${APP_URL}/dashboard`)}
              <p style="margin:24px 0 0 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:12px; line-height:18px; color:${C.inkLight};">
                If you do not wish to join this group, you can ignore this email.
              </p>
            </td>
          </tr>`;

  return emailShell(`You have been invited to ${groupName} on SplitsBug`, body);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Account Deletion Warning
// ─────────────────────────────────────────────────────────────────────────────
export function getAccountDeletionWarningTemplate(userName: string): string {
  const body = `
          <tr>
            <td style="background-color:${C.red}; padding:12px 40px;">
              <p style="margin:0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:12px; font-weight:700; color:#ffffff; text-transform:uppercase; letter-spacing:0.8px; text-align:center;">
                Account deletion notice
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:36px 40px 0 40px;">
              <p style="margin:0 0 24px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:22px; line-height:30px; font-weight:700; color:${C.ink}; letter-spacing:-0.4px;">
                Your account has been scheduled for deletion
              </p>
              <p style="margin:0 0 28px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:15px; line-height:24px; color:${C.inkMid};">
                Hello, <strong style="color:${C.ink};">${userName}</strong>. You have initiated the deletion of your SplitsBug account.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 28px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.redBg}; border:1px solid ${C.redBorder}; border-radius:8px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 8px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:13px; font-weight:700; color:${C.red};">This action is permanent and cannot be undone.</p>
                    <p style="margin:0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:13px; line-height:20px; color:${C.red};">
                      All your groups, expenses, and personal data will be permanently erased and cannot be recovered.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 40px 40px;">
              <p style="margin:0 0 6px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:15px; line-height:24px; color:${C.inkMid};">
                We are sorry to see you go.
              </p>
              <p style="margin:0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:13px; line-height:20px; color:${C.inkLight};">
                If this was a mistake, please log in and cancel the deletion process before it completes.
              </p>
            </td>
          </tr>`;

  return emailShell('Your SplitsBug account is scheduled for deletion', body);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. OTP Verification
// ─────────────────────────────────────────────────────────────────────────────
export function getOtpVerificationTemplate(code: string): string {
  const digits = code.split('').map(d =>
    `<td style="padding:0 4px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="48" height="60" align="center" valign="middle" style="background-color:${C.bg}; border:1px solid ${C.border}; border-radius:8px; font-family:monospace; font-size:28px; font-weight:700; color:${C.brand};">
            ${d}
          </td>
        </tr>
      </table>
    </td>`
  ).join('');

  const body = `
          <tr>
            <td style="padding:36px 40px 0 40px;" align="center">
              <p style="margin:0 0 6px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:11px; font-weight:600; color:${C.brand}; text-transform:uppercase; letter-spacing:0.8px;">Verification</p>
              <p style="margin:0 0 16px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:22px; line-height:30px; font-weight:700; color:${C.ink}; letter-spacing:-0.4px;">
                Your one-time code
              </p>
              <p style="margin:0 0 36px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:15px; line-height:24px; color:${C.inkMid}; max-width:380px;">
                Use the code below to verify your identity. This code expires in <strong style="color:${C.ink};">5 minutes</strong> and can only be used once.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 36px 40px;" align="center">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>${digits}</tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 40px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.bg}; border:1px solid ${C.border}; border-radius:8px;">
                <tr>
                  <td style="padding:16px 24px; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:13px; line-height:20px; color:${C.inkMid}; text-align:center;">
                    If you did not request this code, someone else may be attempting to access your account. You can safely ignore this email.
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;

  return emailShell('Your SplitsBug verification code', body);
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. General Notification
// ─────────────────────────────────────────────────────────────────────────────
export function getGeneralNotificationEmailTemplate(
  title: string,
  message: string,
  actionUrl: string = `${APP_URL}/dashboard`,
  actionLabel: string = 'Open SplitsBug'
): string {
  const body = `
          <tr>
            <td style="padding:36px 40px 0 40px;">
              <p style="margin:0 0 6px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:11px; font-weight:600; color:${C.brand}; text-transform:uppercase; letter-spacing:0.8px;">Notification</p>
              <p style="margin:0 0 24px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:22px; line-height:30px; font-weight:700; color:${C.ink}; letter-spacing:-0.4px;">
                ${title}
              </p>
              <p style="margin:0 0 32px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:15px; line-height:24px; color:${C.inkMid};">
                ${message}
              </p>
              ${primaryButton(actionLabel, actionUrl)}
            </td>
          </tr>
          <tr><td style="height:40px; font-size:0;">&nbsp;</td></tr>`;

  return emailShell(title, body);
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. Farewell / Account Deleted Goodbye Email
// ─────────────────────────────────────────────────────────────────────────────
export function getFarewellEmailTemplate(
  userName: string,
  surveyUrl: string = 'https://forms.google.com/YOUR_SURVEY_LINK_HERE'
): string {
  const body = `
          <tr>
            <td style="padding:36px 40px 0 40px;">
              <p style="margin:0 0 24px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:22px; line-height:30px; font-weight:700; color:${C.ink}; letter-spacing:-0.4px;">
                We are sorry to see you go, ${userName}.
              </p>
              <p style="margin:0 0 16px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:15px; line-height:24px; color:${C.inkMid};">
                Your SplitsBug account and all associated data have been permanently deleted as requested.
              </p>
              <p style="margin:0 0 32px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:15px; line-height:24px; color:${C.inkMid};">
                We built SplitsBug to make sharing expenses effortless. If something fell short of that, we genuinely want to know about it. Your feedback will directly shape the product for everyone who comes after you.
              </p>
            </td>
          </tr>

          <!-- Survey card -->
          <tr>
            <td style="padding:0 40px 32px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${C.border}; border-radius:8px; overflow:hidden;">
                <tr>
                  <td style="padding:10px 24px; background-color:${C.brand};">
                    <p style="margin:0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.8px; color:rgba(255,255,255,0.75);">Quick survey &mdash; 2 minutes</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 6px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:15px; font-weight:600; color:${C.ink};">Help us do better</p>
                    <p style="margin:0 0 20px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:13px; line-height:20px; color:${C.inkMid};">
                      What made you leave? Was something broken, confusing, or missing? Take 2 minutes to tell us.
                      Your response is anonymous and helps the team prioritize the right improvements.
                    </p>
                    ${primaryButton('Take the Survey', surveyUrl)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 40px 40px;">
              <p style="margin:0 0 6px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:14px; line-height:22px; color:${C.inkMid};">
                If you ever decide to come back, you are always welcome. Simply create a new account at any time.
              </p>
              <p style="margin:0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:13px; line-height:20px; color:${C.inkLight};">
                Thank you for being part of SplitsBug.
              </p>
            </td>
          </tr>`;

  return emailShell('We are sorry to see you go &mdash; SplitsBug', body);
}
