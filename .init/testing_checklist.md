# SplitsBug QA Testing Checklist

Here is a comprehensive testing guide designed to help you catch bugs. Follow this step-by-step with a fresh account (and ideally a second test account in an incognito window to test real-time multiplayer features).

## 1. Authentication & Onboarding
- [ ] **Email Signup:** Create a fresh account with Email/Password. Verify the DOB and phone number formatting works.
- [ ] **Welcome Email:** Check your inbox to ensure the new Welcome email arrived and looks good.
- [ ] **Google Signup:** In an incognito window, sign up with a Google account. Ensure you are redirected to the "Complete Profile" screen.
- [ ] **Logout & Login:** Log out and log back in. Ensure you get the "New Device Login Alert" email if logging in from a new browser.
- [ ] **Password Reset:** Try the "Forgot Password" flow on the login screen.

## 2. Profile & Appearance
- [ ] **Edit Profile:** Go to Account > Edit Profile. Change your Name, DOB, and Phone Number. Verify it saves.
- [ ] **Theme Switching:** Go to Appearance. Switch between System, Light, and Dark mode. Does the UI update instantly?
- [ ] **Avatar Color:** Change your theme color. Verify that your avatar (the abstract art or color circle) updates everywhere in the app.

## 3. Group Management (Multiplayer Testing)
*Tip: Keep your main account open in one window, and your test account open in an incognito window.*

- [ ] **Create Group:** Create a new group (e.g., "Goa Trip").
- [ ] **Invite Member:** Invite your test account to the group.
- [ ] **Email Notification:** Verify the test account received the "Group Invite" email.
- [ ] **In-App Notification:** Check the bell icon on the test account's dashboard. Accept the invite.
- [ ] **Role Management:** Go to Group Settings. Change the test account's role from "Editor" to "Viewer".
- [ ] **Viewer Restrictions:** As the test account, try to add an expense. It should be blocked since they are now a Viewer.

## 4. Expenses & Balances
- [ ] **Add Simple Expense:** Add a ₹1,000 expense for "Dinner" paid by YOU, split equally.
- [ ] **Dashboard Balances:** Go to the Dashboard. Verify your main account says "You get back ₹500" and the test account says "You owe ₹500".
- [ ] **Unequal Split:** Add an expense where you paid ₹800, but the test account owes the exact amount of ₹600, and you owe ₹200. Check if the math calculates correctly.
- [ ] **Edit Expense:** Edit the "Dinner" expense. Change the amount to ₹1,200. Check if balances update automatically for both users.
- [ ] **Delete Expense:** Delete an expense and ensure it disappears and balances reset.

## 5. Activity Feed
- [ ] **Group Activity:** Go to the Activity tab inside the group. Ensure you see logs for "Group Created", "User Joined", and "Expense Added".
- [ ] **Global Activity:** Go to the main Activity tab in the bottom navigation. Verify all global activity shows up correctly and the UI looks clean.

## 6. Settle Up (Payments)
- [ ] **Record Payment:** On the test account, click "Settle Up" and record a payment of ₹500 to the main account.
- [ ] **Balance Zero:** Ensure the dashboard now shows you are "Settled up" and the balance is ₹0.
- [ ] **Payment Activity:** Verify a "Payment recorded" event appears in the Activity feed.

## 7. Security & Edge Cases
- [ ] **Change Password:** Go to Security > Change Password. Verify you can successfully change it.
- [ ] **PIN Lock:** Enable the 4-digit PIN lock. Refresh the page. Ensure you are prompted for the PIN before you can see your data.
- [ ] **Export Data:** Click Export Account Data. Ensure the downloaded file contains your correct expenses and groups.
- [ ] **Account Deletion:** Delete the test account. Ensure you get the Farewell Email. Check your main account to verify that the test account's past expenses are **still there** so your balances didn't break.

## 8. Mobile Responsiveness
- [ ] **Mobile View:** Open browser dev tools (F12) and switch to mobile view (iPhone size).
- [ ] **Modals:** Open every modal (Create Group, Add Expense, Settings). Make sure they fit on the screen and the buttons aren't chopped off.
- [ ] **Dropdowns:** Open menus (like the 3-dot menu). Ensure they don't get chopped off by `overflow-hidden` bugs.
