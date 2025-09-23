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
- `media_type` (e.g., "Video", "Written", "Interview", "Screenshot", "Image", "Audio")
- `media_url` (file path or URL)
- `media_title` (optional title for the media)
- `media_description` (optional description for the media)
- `media_format` (e.g., "MP4", "Text", "Image", "PDF", "Audio")

### proof_assets (Legacy - can be removed after migration)
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



## Firebase Database Migration

### Migration from proof_assets to wins media fields

To implement the new simplified media structure, you need to migrate your Firebase data:

#### Step 1: Add new fields to wins collection
For each document in your `wins` collection, add these new fields:
- `media_type` (string): "Video", "Written", "Interview", "Screenshot", "Image", "Audio", etc.
- `media_url` (string): URL or file path to the media
- `media_title` (string, optional): Title for the media
- `media_description` (string, optional): Description for the media  
- `media_format` (string): "MP4", "Text", "Image", "PDF", "Audio", etc.

#### Step 2: Migrate existing proof_assets data
You can use a Firebase script or manually copy data from `proof_assets` collection to the corresponding `wins` documents:
- Copy `asset_type` → `media_type`
- Copy `asset_url` → `media_url`
- Copy `asset_title` → `media_title`
- Copy `asset_description` → `media_description`
- Copy `asset_format` → `media_format`

#### Step 3: Update Firestore security rules (if needed)
Ensure your security rules allow writing to the new media fields in wins documents.

#### Step 4: Test the application
After migration, test that the proof wall displays media correctly and the admin panel can edit media fields.

#### Step 5: Remove proof_assets collection (optional)
Once you've confirmed everything works, you can delete the `proof_assets` collection to clean up your database.

##Improvements

###Issues
Make sure table displays properly after selecting other columns wins (might be when updating), when i added type and category column the category column went before data but the dates stayed aligned to the category column.  
####Data infrastructure
✅ Make wins have their own media, doesn't have to be part of proof assets for simplicity, Update database and tell me what to change in firebase



###Admin

#####Coaches
1. Add filter to coaches; Filter by Number of wins (more or less than), join date, most recent win (Shoudl be able to do before or after), type of win (so it would look at which couches don't have e.g. video)
2. Remove group by button and functiomality


#####Single Coaches Page


####Wins

#####Wins List
1. Have win title be the first column and coach the second column
2. When click on win title it open the win (do not need it to be blue or underlined
3. By default show category e.g. 1st clients and type e.g. video
3. Make sure table renders properly

#####Single Win page
1. Display the media 
2. Allow for files to be uploaded and type e.g. video screenshot selected. 
3. Show the content field 

###Proof Wall
- do not show the names of the files. 
- add a keyword search
- add a type search )this should filter by the new wins media type e.g. video, written, interview, screenshot,
