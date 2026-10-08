# Placement Radar — V1.6

Placement Radar is an AI-style placement readiness MVP that follows the loop:
**Diagnose → Prioritize → Act → Measure → Re-prioritize**.

## V1.6 — Google account login + user-specific progress

This version adds:
- Google sign-in / automatic sign-up through Firebase Authentication.
- A separate user data space for every Google account.
- Cloud persistence through Firebase Firestore.
- Per-user profile, diagnostic answers, readiness result, personalized plan and daily progress.
- Local browser cache namespaced by Firebase user ID, so users on the same browser do not share Placement Radar data.
- `Radar` now points to one clear **See My Plan** action rather than asking the user to build the plan again.
- Top navigation uses **Radar · My Plan · Progress**.
- Daily quick checks remain topic-specific: each plan day uses the topic attached to that day.

## Important: Firebase setup

The project contains the complete frontend integration, but a Firebase project must be connected before real Google authentication and cloud storage can work. Firebase project credentials cannot be generated from this static codebase.

### 1. Create a Firebase project

Open Firebase Console and create a project.

### 2. Enable Google Authentication

In Firebase Console:
- Authentication → Sign-in method
- Enable **Google**
- Add your deployment domain under Authorized domains if required.

### 3. Create Firestore

Create a Firestore database in production/test mode as appropriate for your hackathon environment.

### 4. Add the Web App

Project settings → Your apps → Web app. Copy the Firebase Web App configuration.

Open:

`js/firebase-config.js`

Replace the `YOUR_...` values with your project configuration.

The Firebase Web API configuration is intended for browser use; database security is enforced by Firestore rules, not by hiding the web config.

### 5. Apply Firestore rules

Use the rules in `firestore.rules`. They allow an authenticated user to read/write only:

`users/{their-own-uid}/app/{document}`

A user cannot access another user's Placement Radar document through these rules.

## User data model

```text
users
  └── {firebaseUid}
       └── app
            └── state
                 ├── profile
                 ├── answers
                 ├── diagnosticMeta
                 ├── questionBank
                 ├── result
                 ├── adaptivePlan
                 └── progressLogs
```

## Authentication flow

```text
Google Login
   ↓
Firebase Authentication
   ↓
Firebase UID
   ↓
Load that user's Firestore state
   ↓
Radar / Profile / Plan / Progress
```

A new Google account automatically becomes a Placement Radar user. No separate password is required.

## Running locally

For a reliable Firebase authentication test, serve the folder through a local web server rather than opening HTML files directly.

For example with VS Code Live Server, open `login.html` through the local server URL.

## Hackathon note

Do not commit private service-account JSON files, Firebase Admin credentials, or other server secrets. The browser Firebase configuration in `js/firebase-config.js` is not an Admin SDK credential; Firestore rules and Firebase Authentication control access.

## V1.7 Authentication
Placement Radar now supports two account methods: email/password Sign In and Sign Up, plus Continue with Google. Password reset is available from the Sign In screen. Firebase Authentication must have Email/Password and Google providers enabled. Each authenticated user's state is stored under their Firebase UID in Firestore.
