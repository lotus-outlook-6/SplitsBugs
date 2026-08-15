export function getWelcomeEmailTemplate(userName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Welcome to SplitsBug</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f2f8; font-family:Helvetica, Arial, sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f2f8; padding:40px 0;">
  <tr>
    <td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; max-width:600px; width:100%;">
        <tr>
          <td align="center" style="background-color:#5b21b6; padding:32px 24px;">
            <img src="https://splitsbug-app.web.app/SplitBugs-Brand/logos/logo-wordmark.png" width="150" alt="SplitsBug" style="display:block; width:150px; max-width:150px; height:auto; border:0;">
          </td>
        </tr>
        <tr>
          <td style="padding:40px 40px 24px 40px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family:Helvetica, Arial, sans-serif; font-size:22px; line-height:28px; color:#1a1a1a; font-weight:bold; padding-bottom:16px;">
                  Welcome to SplitsBug, ${userName}! 👋
                </td>
              </tr>
              <tr>
                <td style="font-family:Helvetica, Arial, sans-serif; font-size:16px; line-height:24px; color:#4a4a4a; padding-bottom:32px;">
                  We're excited to have you on board. Tracking shared expenses and settling up is now easier than ever.
                </td>
              </tr>
              <tr>
                <td align="left">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center" style="border-radius:8px; background-color:#5b21b6;">
                        <a href="https://splitsbug-app.web.app/dashboard" target="_blank" style="display:inline-block; padding:14px 32px; font-family:Helvetica, Arial, sans-serif; font-size:16px; font-weight:bold; color:#ffffff; text-decoration:none; border-radius:8px;">
                          Create Your First Group
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="border-top:1px solid #eeeeee; font-size:0; line-height:0;">&nbsp;</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:24px 40px 32px 40px;">
            <p style="margin:0; font-family:Helvetica, Arial, sans-serif; font-size:12px; line-height:18px; color:#9a9a9a;">
              SplitsBug © 2026. All rights reserved. If you have questions, reply to this email.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

export function getNewDeviceLoginAlertTemplate(userName: string, deviceInfo: string, time: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>New Login to Your SplitsBug Account</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f2f8; font-family:Helvetica, Arial, sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f2f8; padding:40px 0;">
  <tr>
    <td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; max-width:600px; width:100%;">
        <tr>
          <td align="center" style="background-color:#5b21b6; padding:32px 24px;">
            <img src="https://splitsbug-app.web.app/SplitBugs-Brand/logos/logo-wordmark.png" width="150" alt="SplitsBug" style="display:block; width:150px; max-width:150px; height:auto; border:0;">
          </td>
        </tr>
        <tr>
          <td style="padding:40px 40px 24px 40px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family:Helvetica, Arial, sans-serif; font-size:22px; line-height:28px; color:#1a1a1a; font-weight:bold; padding-bottom:16px;">
                  New login detected 🔐
                </td>
              </tr>
              <tr>
                <td style="font-family:Helvetica, Arial, sans-serif; font-size:16px; line-height:24px; color:#4a4a4a; padding-bottom:24px;">
                  Hi ${userName}, we noticed a new login to your SplitsBug account from <strong>${deviceInfo}</strong> on <strong>${time}</strong>.
                </td>
              </tr>
              <tr>
                <td style="padding-bottom:32px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fff8e1; border-left:4px solid #f59e0b; border-radius:4px;">
                    <tr>
                      <td style="padding:16px 20px; font-family:Helvetica, Arial, sans-serif; font-size:14px; line-height:21px; color:#7a5c00;">
                        If this was you, you can ignore this email. If you don't recognize this activity, please secure your account immediately.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td align="left">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center" style="border-radius:8px; background-color:#5b21b6;">
                        <a href="https://splitsbug-app.web.app/security" target="_blank" style="display:inline-block; padding:14px 32px; font-family:Helvetica, Arial, sans-serif; font-size:16px; font-weight:bold; color:#ffffff; text-decoration:none; border-radius:8px;">
                          Secure Account
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="border-top:1px solid #eeeeee; font-size:0; line-height:0;">&nbsp;</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:24px 40px 32px 40px;">
            <p style="margin:0; font-family:Helvetica, Arial, sans-serif; font-size:12px; line-height:18px; color:#9a9a9a;">
              SplitsBug © 2026. All rights reserved. If you have questions, reply to this email.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

export function getGroupInviteNotificationTemplate(userName: string, inviterName: string, groupName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>You've Been Invited to a Group on SplitsBug</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f2f8; font-family:Helvetica, Arial, sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f2f8; padding:40px 0;">
  <tr>
    <td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; max-width:600px; width:100%;">
        <tr>
          <td align="center" style="background-color:#5b21b6; padding:32px 24px;">
            <img src="https://splitsbug-app.web.app/SplitBugs-Brand/logos/logo-wordmark.png" width="150" alt="SplitsBug" style="display:block; width:150px; max-width:150px; height:auto; border:0;">
          </td>
        </tr>
        <tr>
          <td style="padding:40px 40px 24px 40px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family:Helvetica, Arial, sans-serif; font-size:22px; line-height:28px; color:#1a1a1a; font-weight:bold; padding-bottom:16px;">
                  You're invited! 🎉
                </td>
              </tr>
              <tr>
                <td style="font-family:Helvetica, Arial, sans-serif; font-size:16px; line-height:24px; color:#4a4a4a; padding-bottom:28px;">
                  Hi ${userName}, <strong>${inviterName}</strong> has invited you to join the group <strong>${groupName}</strong> on SplitsBug!
                </td>
              </tr>
              <tr>
                <td style="padding-bottom:32px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f7f4fc; border-radius:8px;">
                    <tr>
                      <td style="padding:20px 24px;">
                        <p style="margin:0 0 4px 0; font-family:Helvetica, Arial, sans-serif; font-size:12px; line-height:16px; color:#8b6fd6; text-transform:uppercase; letter-spacing:0.5px; font-weight:bold;">
                          Group
                        </p>
                        <p style="margin:0; font-family:Helvetica, Arial, sans-serif; font-size:18px; line-height:24px; color:#1a1a1a; font-weight:bold;">
                          ${groupName}
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td align="left">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center" style="border-radius:8px; background-color:#5b21b6;">
                        <a href="https://splitsbug-app.web.app/dashboard" target="_blank" style="display:inline-block; padding:14px 32px; font-family:Helvetica, Arial, sans-serif; font-size:16px; font-weight:bold; color:#ffffff; text-decoration:none; border-radius:8px;">
                          View Invitation
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="border-top:1px solid #eeeeee; font-size:0; line-height:0;">&nbsp;</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:24px 40px 32px 40px;">
            <p style="margin:0; font-family:Helvetica, Arial, sans-serif; font-size:12px; line-height:18px; color:#9a9a9a;">
              SplitsBug © 2026. All rights reserved. If you have questions, reply to this email.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

export function getAccountDeletionWarningTemplate(userName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your SplitsBug Account Has Been Scheduled for Deletion</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f2f8; font-family:Helvetica, Arial, sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f2f8; padding:40px 0;">
  <tr>
    <td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; max-width:600px; width:100%;">
        <tr>
          <td align="center" style="background-color:#5b21b6; padding:32px 24px;">
            <img src="https://splitsbug-app.web.app/SplitBugs-Brand/logos/logo-wordmark.png" width="150" alt="SplitsBug" style="display:block; width:150px; max-width:150px; height:auto; border:0;">
          </td>
        </tr>
        <tr>
          <td style="background-color:#fdecec; padding:14px 40px; border-bottom:1px solid #f7c9c9;">
            <p style="margin:0; font-family:Helvetica, Arial, sans-serif; font-size:13px; line-height:18px; color:#b91c1c; font-weight:bold; text-align:center; letter-spacing:0.3px;">
              ⚠ ACCOUNT DELETION NOTICE
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 40px 24px 40px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family:Helvetica, Arial, sans-serif; font-size:22px; line-height:28px; color:#1a1a1a; font-weight:bold; padding-bottom:16px;">
                  Your account is scheduled for deletion
                </td>
              </tr>
              <tr>
                <td style="font-family:Helvetica, Arial, sans-serif; font-size:16px; line-height:24px; color:#4a4a4a; padding-bottom:24px;">
                  Hi ${userName}, your SplitsBug account has been scheduled for permanent deletion.
                </td>
              </tr>
              <tr>
                <td style="padding-bottom:24px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fdecec; border-left:4px solid #dc2626; border-radius:4px;">
                    <tr>
                      <td style="padding:16px 20px; font-family:Helvetica, Arial, sans-serif; font-size:14px; line-height:21px; color:#b91c1c; font-weight:bold;">
                        All your data and expense history will be permanently wiped and cannot be recovered.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="font-family:Helvetica, Arial, sans-serif; font-size:16px; line-height:24px; color:#4a4a4a;">
                  We're sorry to see you go!
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="border-top:1px solid #eeeeee; font-size:0; line-height:0;">&nbsp;</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:24px 40px 32px 40px;">
            <p style="margin:0; font-family:Helvetica, Arial, sans-serif; font-size:12px; line-height:18px; color:#9a9a9a;">
              SplitsBug © 2026. All rights reserved. If you have questions, reply to this email.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}
