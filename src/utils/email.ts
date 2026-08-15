export interface EmailOptions {
  to: string;
  subject: string;
  templateId: 'welcome' | 'new-device' | 'group-invite' | 'account-deletion';
  templateData: any;
}

/**
 * Sends an email securely via the backend API route.
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Failed to send email:', result.error);
      return { success: false, error: result.error || 'Failed to send email' };
    }

    console.log('Email sent successfully!', result.data);
    return { success: true, data: result.data };
  } catch (err: any) {
    console.error('Error in sendEmail utility:', err);
    return { success: false, error: err.message || 'Unknown error' };
  }
}
