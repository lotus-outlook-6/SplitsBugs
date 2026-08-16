export interface EmailOptions {
  to: string;
  subject: string;
  templateId: 'welcome' | 'new-device' | 'group-invite' | 'account-deletion';
  templateData: any;
}

import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

/**
 * Sends an email securely via the backend API route.
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    // Only check preferences for non-critical emails (OTP must always send)
    if (options.templateId !== 'otp') {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', options.to));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        if (userData.emailNotifs === false) {
          console.log(`Email to ${options.to} skipped: User disabled email notifications.`);
          return { success: true, data: 'Skipped due to user preferences' };
        }
      }
    }
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
