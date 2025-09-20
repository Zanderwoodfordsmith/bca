# Firebase Authentication Setup Guide

## 🔐 Enable Authentication in Firebase Console

### Step 1: Enable Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `business-coach-academy-proof`
3. Click **Authentication** in the left sidebar
4. Click **Get started** if you haven't set it up yet

### Step 2: Configure Sign-in Methods
1. Click on **Sign-in method** tab
2. Enable **Google** provider:
   - Click on Google
   - Toggle **Enable**
   - Set **Project support email** to your admin email
   - Add **Authorized domains**: `businesscoachacademy.com` (your domain)
   - Click **Save**

3. Enable **Email/Password** provider:
   - Click on Email/Password
   - Toggle **Enable**
   - Optionally enable **Email link (passwordless sign-in)**
   - Click **Save**

### Step 3: Set Up Authorized Domains
1. In Authentication → Settings → Authorized domains
2. Add your domains:
   - `businesscoachacademy.com`
   - `localhost` (for development)
   - Your hosting domain

## 👥 Create Admin Users Collection

### Step 4: Set Up Admin Users
You need to create the `admin_users` collection in Firestore to control who can access the admin panel.

1. Go to **Firestore Database**
2. Click **Start collection**
3. Collection ID: `admin_users`
4. Add your first admin user:

**Document ID**: Use the UID from Firebase Authentication (you'll get this after first login)

**Fields**:
```
displayName: "Your Name"
email: "your@businesscoachacademy.com"
role: "admin"
status: "active"
createdAt: [timestamp]
```

### Step 5: Test the Setup
1. Go to your login page: `your-domain.com/login.html`
2. Try signing in with Google using your business email
3. If successful, you'll be redirected to the admin panel
4. If not authorized, you'll see an error message

## 🛡️ Firestore Security Rules

### Step 6: Update Security Rules
Go to **Firestore Database** → **Rules** and update with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin users collection - only authenticated users can read
    match /admin_users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        resource == null; // Only allow creating new users
    }
    
    // User invitations collection
    match /user_invitations/{invitationId} {
      allow read, write: if request.auth != null;
    }
    
    // Main data collections - only authenticated admin users
    match /coaches/{document} {
      allow read, write: if request.auth != null;
    }
    
    match /wins/{document} {
      allow read, write: if request.auth != null;
    }
    
    match /proof_assets/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📧 Email Integration (Optional)

### Step 7: Set Up Email Invitations
For the invitation system to work, you'll need to integrate with an email service:

**Options**:
1. **Firebase Functions** with SendGrid
2. **Firebase Functions** with AWS SES
3. **Firebase Functions** with Nodemailer
4. **Third-party services** like Mailgun, Postmark

**Example Firebase Function** (Node.js):
```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

exports.sendInvitation = functions.firestore
  .document('user_invitations/{invitationId}')
  .onCreate(async (snap, context) => {
    const invitation = snap.data();
    
    // Send email logic here
    // ...
    
    return null;
  });
```

## 🚀 First-Time Setup

### Step 8: Create Your First Admin
1. **Temporarily disable authentication** by commenting out the auth check in `admin.js`
2. **Access admin panel** directly
3. **Go to Settings** → **Invite Users**
4. **Invite yourself** with admin role
5. **Re-enable authentication**
6. **Test login** with your invited email

## 🔧 Configuration Notes

### Google Sign-In Configuration
- **Domain restriction**: Set to `businesscoachacademy.com` in login.js
- **OAuth consent screen**: Configure in Google Cloud Console
- **Authorized redirect URIs**: Firebase handles this automatically

### User Roles
- **admin**: Full access to all features
- **editor**: Can edit content but not manage users
- **viewer**: Read-only access

### Security Considerations
- **HTTPS required** for production
- **Domain verification** for Google OAuth
- **Regular security rule reviews**
- **User access audits**

## 🆘 Troubleshooting

### Common Issues:
1. **"Not authorized" error**: User not in `admin_users` collection
2. **Google sign-in fails**: Check domain restrictions
3. **Email invitations not sending**: Email service not configured
4. **Redirect loops**: Check Firebase project configuration

### Debug Steps:
1. Check browser console for errors
2. Verify Firebase project settings
3. Test with different browsers
4. Check network tab for failed requests

## 📞 Support

If you need help with setup:
1. Check Firebase documentation
2. Review browser console errors
3. Test with a simple email/password account first
4. Verify all collections and documents exist

**Remember**: Always test in a development environment before deploying to production!
