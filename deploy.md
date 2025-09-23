# Deploy to Firebase Hosting

## Option 1: Using Firebase Console (Recommended)

1. Go to: https://console.firebase.google.com/
2. Select project: "Business Coach Academy Proof"
3. Go to: Hosting → Manage site
4. Click "Deploy" or "Add files"
5. Upload the entire `public` folder

## Option 2: Using Firebase CLI (if you have it installed)

```bash
firebase login
firebase deploy --only hosting
```

## Files Ready for Deployment

Your admin panel files are now in the `public` folder:
- admin.html
- admin.js
- admin-styles.css
- firebase-config.js

## Access Your Admin Panel

Once deployed, your team can access:
- https://proof.businesscoachacademy.com/admin.html

## Next Steps

1. Deploy the files
2. Test the admin panel at your custom domain
3. Share the URL with your team
4. Test file uploads to ensure Firebase Storage works
