// Firebase Configuration
// Your actual Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyBInbl3cyEV5vK5ExogPq5ghNe0ShhkV98",
    authDomain: "business-coach-academy-proof.firebaseapp.com",
    projectId: "business-coach-academy-proof",
    storageBucket: "business-coach-academy-proof.firebasestorage.app",
    messagingSenderId: "661996928855",
    appId: "1:661996928855:web:d71ad3e37828a364738812"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Export for use in other files
window.db = db;
