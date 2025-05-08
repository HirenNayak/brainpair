# 🧠 BrainPair – Study Partner Matching App

BrainPair is a React-based study partner matching application where students can match based on university, interests, and availability. Built with Firebase, React, Realtime DB, and modern UI components.

---

## 🚀 Features

- 🔐 User Registration & Login (Firebase Auth)
- 📄 Profile Setup with University, Course, Interests
- 📸 Image Upload to Cloudinary
- 🔄 Swipe-based Matching System
- 💬 Real-time Chat (using Firebase Realtime DB)
- ⏱️ Pomodoro Timer
- 👥 View & Manage Matches + Profile Editing
- 🔔 Toast Notifications for new messages

---

## 🛠️ Setup Instructions

> ✅ These steps are for **first-time setup** or if you're running the app on a new machine.

### 1. 🔽 Clone the Repository

Clone the project and navigate to the folder:

git clone https://github.com/HirenNayak/brainpair
cd brainpair


### 2. 📁 Navigate to the Frontend Folder

All the code and configuration is inside the `frontend/` directory:


### 3. 📦 Install Dependencies

Install all necessary npm packages:


This will install:

- react-router-dom  
- react-toastify  
- react-slick  
- slick-carousel  
- firebase  
- tailwindcss *(if used)*  
- and more

### 4. ▶️ Run the App

Start the development server:


Then open your browser and go to:  
[http://localhost:3000](http://localhost:3000)

---

## ⚠️ Common Issues

| Issue                    | Solution                                                                 |
|--------------------------|--------------------------------------------------------------------------|
| Blank screen             | Make sure you ran `npm install` inside the `frontend/` folder            |
| `ref is not a function`  | Ensure you're importing `ref` from `firebase/database`                   |
| Image upload fails       | Confirm your Cloudinary credentials and preset are correct               |
| Firebase errors          | Ensure your `firebase-config.js` uses your actual Firebase project keys  |

---

## 📁 Folder Structure

brainpair/
│
├── frontend/ # React app source code
│ ├── pages/ # App pages like ChatPage, DashboardPage, etc.
│ ├── components/ # Reusable UI components
│ ├── firebase/ # Firebase configuration and setup
│ ├── App.js # Main route handler
│ └── package.json # All dependencies for the app
│
├── README.md # This setup guide
└── .gitignore # Ignored files for Git