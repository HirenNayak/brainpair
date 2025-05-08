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
- tailwindcss 
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
| Image upload fails       | Use user.uid for folder/public ID. Check Cloudinary preset settings.     |
| Firebase errors          | Ensure your `firebase-config.js` uses your actual Firebase project keys  |

---

## 📁 Folder Structure

```bash
📁 brainpair/
├── frontend/
│   └── src/
│       ├── components/           # Reusable UI components (Button, Footer, Header, etc.)
│       ├── pages/                # App pages like ChatPage, DashboardPage, etc.
│       ├── firebase/             # Firebase configuration file
│       ├── utils/                # Any utility/helper functions (if used)
│       ├── App.js                # Main route handler
│       ├── index.js              # Entry point
│       ├── App.css, index.css    # Global styles
│       └── logo.svg              # Branding/logo
├── .gitignore                    # Ignored files for Git
├── package.json                  # Project dependencies and scripts
├── README.md                     # Project documentation
```
