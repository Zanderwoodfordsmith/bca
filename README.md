# Business Coach Academy Proof Wall

A modern, responsive testimonial wall for showcasing coach achievements and client testimonials. Built with Firebase Firestore and vanilla JavaScript.

## Features

✅ **Firebase Integration** - Real-time data from Firestore database  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  
✅ **Top 20 + Load More** - Displays latest testimonials with pagination  
✅ **Iframe Embedding** - Generate embed codes for external websites  
✅ **Preview Mode** - See how the proof wall looks before embedding  
✅ **Verification System** - Only shows verified testimonials  
✅ **Multiple Asset Types** - Supports videos, images, quotes, and case studies  
✅ **Modern UI** - Beautiful gradient design with smooth animations  

## Quick Start

1. **Clone or download** this project
2. **Follow the Firebase setup** instructions in `FIREBASE_SETUP.md`
3. **Open `index.html`** in your web browser
4. **Customize** the styling and add your data

## Project Structure

```
Proof Wall/
├── index.html              # Main application file
├── styles.css              # Styling and responsive design
├── app.js                  # Core application logic
├── firebase-config.js      # Firebase configuration
├── FIREBASE_SETUP.md       # Detailed setup instructions
└── README.md               # This file
```

## Database Schema

### coaches
- `coach_id` (primary key)
- `first_name`
- `last_name` 
- `join_date`
- `bio` (background)

### wins
- `win_id` (primary key)
- `coach_id` (foreign key)
- `win_title` (e.g., "First Client Signed")
- `win_description`
- `win_date`
- `win_category` (e.g., "First Client", "Revenue Milestone", "Breakthrough")
- `verification_status` (verified/pending/unverified)

### proof_assets
- `asset_id` (primary key)
- `win_id` (foreign key)
- `asset_type` (e.g., "Video Testimonial", "Written Quote", "Social Post", "Case Study")
- `asset_format` (e.g., "MP4", "Text", "Image", "PDF")
- `asset_url` (file path)
- `asset_title`
- `asset_description`
- `created_date`
- `approval_status` (approved/pending/rejected)
- `usage_rights` (internal/public/restricted)

## Usage

### Viewing Testimonials
- Testimonials are sorted by recency (newest first)
- Only verified testimonials with approved assets are displayed
- Click "Load More" to see additional testimonials

### Preview Mode
- Click "Preview Mode" to see how the proof wall will look when embedded
- Useful for testing and customization

### Embedding
- Click "Generate Embed Code" to get iframe code
- Copy the code and paste it into any website
- The embedded proof wall will be responsive and styled

## Customization

### Styling
Edit `styles.css` to customize:
- Colors and gradients
- Fonts and typography
- Layout and spacing
- Responsive breakpoints

### Functionality
Edit `app.js` to modify:
- Number of testimonials per page
- Sorting criteria
- Filter options
- Asset display logic

## Firebase Setup

For detailed Firebase setup instructions, see `FIREBASE_SETUP.md`. You'll need to:

1. Create a Firebase project
2. Set up Firestore database
3. Configure security rules
4. Add your Firebase config to `firebase-config.js`
5. Import your data into the collections

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is open source and available under the MIT License.

## Support

If you need help with setup or customization, check the `FIREBASE_SETUP.md` file for detailed instructions and troubleshooting tips.