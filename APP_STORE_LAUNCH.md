# App Store Launch & Growth Plan (Prioritized)

This document outlines the steps required to launch, ordered from **strict submission blockers** to longer-term growth features.

## 🚨 1. Submission Blockers (CRITICAL)
**Status: Mandatory.** Apple will reject the app binary or metadata without these.

- [ ] **App Icon**: 
    - Requirement: 1024x1024px PNG. No transparency.
    - *Psychology*: Must stand out on a cluttered home screen. Avoid generic food clipart. Use vibrant colors (e.g., Orange/Green).
- [ ] **Privacy Policy URL**: 
    - Requirement: A publicly accessible URL (e.g., Notion page or simple HTML on Render) stating data usage.
    - *Note*: You CANNOT submit without this.
- [ ] **Support URL**: 
    - A way for users to contact you (Email link or Form).
- [ ] **EULA (End User License Agreement)**: 
    - Standard Apple EULA covering usage rights. Can be a text link in the Settings page.
- [ ] **Splash Screen**: 
    - Requirement: `splash.png` configuration in `app.json`.
    - Must match the app's background color (`#121212`) to preventing jarring "white flashes" on startup.

## 🛡 2. App Quality & Stability (HIGH)
**Status: Highly Recommended.** Prevents "broken" experiences that lead to immediate 1-star reviews.

- [ ] **Empty State Handling**: 
    - "My Plans" and "Shopping List" must NOT be empty white/black space on first load.
    - *Action*: Add a clear CTA: *"No plans yet? Tap here to create one!"*
- [ ] **Error Boundaries**: 
    - Prevent the generic "App has stopped working" crash.
    - *Action*: Wrap the app in a component that catches errors and shows a "Whoops, reload" button.
- [ ] **Sentry Integration**: 
    - We need to know *why* it crashed for users in the wild (since we can't see their logs).

## 🏪 3. Store Presence (HIGH)
**Status: Mandatory for success.** You need these to fill out the App Store Connect listing.

- [ ] **Screenshots**: 
    - Don't just screenshot the UI. Use a "Device Frame" generator (like Rotato or Canva) with benefit-driven text above the phone.
    - *Slide 1*: "Stop asking 'What's for dinner?'"
    - *Slide 2*: "Generate weekly plans in 1 tap."
    - *Slide 3*: "Automatic Grocery Lists."
- [ ] **App Description**: 
    - Focus on the *problem* (Decision Fatigue), not the stack.
    - *Keywords*: Meal prep, grocery list, keto planner, diet tracker.
- [ ] **Keywords Field**: 
    - 100 characters max. Comma-separated, no spaces. `meal,planner,keto,diet,grocery,list,healthy,recipe,food`

## 🧠 4. User Experience (MEDIUM)
**Status: Important.** Helps retention by making the app feel "nice" rather than "functional".

- [ ] **Loading Psychology**: 
    - Replace spinners with "Skeleton Screens" or playful text ("Chopping vegetables...", "Heating the oven...") to make wait times feel shorter.
- [ ] **Golden Path Onboarding**: 
    - A simple 3-slide intro carousel for new users explaining the value prop before they see the form.

## 🚀 5. Growth & Engagement (LOW)
**Status: Post-Launch.** Features to drive habit formation.

- [ ] **"The Sunday Ritual" Notification**: 
    - Local Notification prompting users on Sunday morning to generate a plan.
- [ ] **Gamification**: 
    - "Visual Streak" counter to encourage weekly planning consistency.
- [ ] **Feedback Mechanism**: 
    - A "Send Feedback" button in Settings to intercept negative reviews.
