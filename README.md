# 🧠 BrainPair – Study Partner Matching App

BrainPair is a React-based study partner matching application where students can match based on university, interests, and availability. Built with Firebase, React, Realtime DB, and modern UI components.

---

## 🚀 Features

- 🔐 **User Authentication** – Register/Login with Firebase Auth  
- 👤 **Profile Setup** – Choose university, course, interests, and availability  
- 📸 **Image Upload** – Upload profile photos to Cloudinary  
- 🔄 **Swipe-Based Matching** – Match based on mutual interests and schedules  
- 💬 **Real-Time Chat** – One-on-one and group chat using Firebase Realtime Database  
- 📅 **Study Streak Tracker** – Track your consecutive study days  
- 🧠 **Pomodoro Timer** – Integrated productivity timer  
- 👥 **Groups & Group Chat** – Create or join study groups  
- ⚙️ **Dark Mode & Profile Settings** – Customize experience and manage your profile  
- 🔔 **Live Notifications** – Toasts for actions like message updates and logouts  

---

## 🛠️ Setup Instructions

> ✅ These steps are for **first-time setup** or if you're running the app on a new machine.

### 1. 🔽 Clone the Repository

Clone the project and navigate to the folder:


git clone https://github.com/HirenNayak/brainpair
cd brainpair


### 2. 📁 Navigate to the Frontend Folder

All the code and configuration is inside the `frontend/` directory:

cd frontend


### 3. 📦 Install Dependencies

Install all necessary npm packages:


npm install

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
│   ├── src/
│   │   ├── components/             # UI components (Header, Footer, Cards, Modals, etc.)
│   │   │   ├── Card.js
│   │   │   ├── DarkModeToggle.js
│   │   │   ├── Footer.js
│   │   │   ├── Header.js
│   │   │   ├── MatchCelebrationModal.js
│   │   │   ├── MessageListener.js
│   │   │   ├── Progress.js
│   │   │   ├── ReviewModal.js
│   │   │   └── StreakCard.js
│   │   ├── firebase/               # Firebase project config
│   │   │   └── firebase-config.js
│   │   ├── pages/                  # Main application pages/screens
│   │   │   ├── CalendarPage.js
│   │   │   ├── ChatPage.js
│   │   │   ├── ConnectionsPage.js
│   │   │   ├── DashboardPage.js
│   │   │   ├── ForumsPage.js
│   │   │   ├── GroupChatPage.js
│   │   │   ├── GroupsPage.js
│   │   │   ├── ImageUploadPage.js
│   │   │   ├── LandingPage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── MatchesPage.js
│   │   │   ├── PomodoroTimerApp.js
│   │   │   ├── ProfileSetupPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── StudyStreakPage.js
│   │   │   └── UserProfileSettings.js
│   │   ├── utils/                  # Logic & helper services
│   │   │   ├── groupService.js
│   │   │   ├── matchHandler.js
│   │   │   ├── matchUtils.js
│   │   │   ├── reviewService.js
│   │   │   ├── streakHandler.js
│   │   │   └── streakUtils.js
│   │   ├── unitTests/              # Unit tests for logic modules
│   │   ├── App.js                  # Main routing logic
│   │   ├── index.js                # React entry point
│   │   └── App.css / index.css     # Global styles
├── .gitignore
├── README.md
├── package.json

```
