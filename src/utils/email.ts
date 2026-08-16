export interface EmailOptions {
  to: string;
  subject: string;
  templateId: 'welcome' | 'new-device' | 'group-invite' | 'account-deletion' | 'otp' | 'general';
  templateData: any;
}

import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

/**
 * Sends an email securely via the backend API route.
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const isSecurityEmail = ['otp', 'new-device', 'welcome', 'account-deletion'].includes(options.templateId);
    
    // Only check preferences for non-critical notifications
    if (!isSecurityEmail) {
      try {
        let emailNotifsEnabled = true;
        // Check direct document ID lookup first
        const userDocRef = doc(db, 'users', options.to);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (userData.emailNotifs === false) {
            emailNotifsEnabled = false;
          }
        } else {
          // Fallback to query
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('email', '==', options.to));
          const snapshot = await getDocs(q);
          if (!snapshot.empty && snapshot.docs[0].data().emailNotifs === false) {
            emailNotifsEnabled = false;
          }
        }
        
        if (!emailNotifsEnabled) {
          console.log(`Email to ${options.to} skipped: User disabled email notifications.`);
          return { success: true, data: 'Skipped due to user preferences' };
        }
      } catch (prefErr) {
        console.warn('Preference check error, proceeding to send email:', prefErr);
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

