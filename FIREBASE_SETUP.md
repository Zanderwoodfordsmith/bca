# Firebase Setup Instructions

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: "business-coach-academy-proof-wall"
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Set up Firestore Database

1. In your Firebase project, click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (we'll configure security rules later)
4. Select a location for your database (choose closest to your users)
5. Click "Done"

## Step 3: Get Firebase Configuration

1. In your Firebase project, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (`</>`) to add a web app
5. Enter app nickname: "proof-wall-web"
6. Click "Register app"
7. Copy the Firebase configuration object

## Step 4: Update Firebase Configuration

1. Open `firebase-config.js` in your project
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

## Step 5: Set up Firestore Collections

You need to create three collections in Firestore. You can do this manually or use the sample data script below.

### Collections to Create:

1. **coaches** - Coach information
2. **wins** - Coach achievements and testimonials
3. **proof_assets** - Supporting media and documents

### Sample Data Structure:

#### coaches collection:
```json
{
  "coach_id": "coach_001",
  "first_name": "Sarah",
  "last_name": "Johnson",
  "join_date": "2023-10-01T00:00:00Z",
  "bio": "Transformational life coach specializing in career transitions"
}
```

#### wins collection:
```json
{
  "win_id": "win_001",
  "coach_id": "coach_001",
  "win_title": "First Client Signed",
  "win_description": "Successfully signed my first paying client after 3 months of building my coaching practice.",
  "win_date": "2024-01-15T00:00:00Z",
  "win_category": "First Client",
  "verification_status": "verified"
}
```

#### proof_assets collection:
```json
{
  "asset_id": "asset_001",
  "win_id": "win_001",
  "asset_type": "Written Quote",
  "asset_format": "Text",
  "asset_url": "https://example.com/testimonial.jpg",
  "asset_title": "Client Testimonial",
  "asset_description": "The coaching process was life-changing for me.",
  "created_date": "2024-01-16T00:00:00Z",
  "approval_status": "approved",
  "usage_rights": "public"
}
```

## Step 6: Configure Security Rules (Optional but Recommended)

1. Go to Firestore Database → Rules
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all collections for the proof wall
    match /{collection}/{document} {
      allow read: if true;
      allow write: if false; // Only allow writes through Firebase Admin SDK or authenticated users
    }
  }
}
```

## Step 7: Test Your Setup

1. Open `index.html` in your web browser
2. You should see the proof wall with sample data
3. If you see an error, check the browser console and verify your Firebase configuration

## Step 8: Add Real Data

Once your setup is working, you can add real coach data by:

1. Going to Firestore Database in Firebase Console
2. Clicking "Start collection"
3. Adding documents with the structure shown above

## Troubleshooting

### Common Issues:

1. **"Firebase not initialized" error**: Check that your Firebase config is correct
2. **"Permission denied" error**: Check your Firestore security rules
3. **No data showing**: Ensure you have documents in your collections with the correct field names
4. **CORS errors**: Make sure your domain is added to Firebase authorized domains (if needed)

### Getting Help:

- Check the browser console for error messages
- Verify your Firebase project is active and billing is set up (if using production mode)
- Ensure all required fields are present in your Firestore documents

## Next Steps

Once your Firebase setup is complete:

1. Add real coach and testimonial data
2. Customize the styling in `styles.css`
3. Deploy your proof wall to a web hosting service
4. Share the embed code with other websites

Your proof wall is now ready to showcase coach achievements and testimonials!
