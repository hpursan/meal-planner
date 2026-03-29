# 🚀 The Golden Stack: App Launch Playbook
**From Ideation to App Store in Record Time**

This guide documents the infrastructure, design principles, and deployment workflows used to build and ship the Meal Planner app. Use this as a blueprint to launch future high-quality mobile apps efficiently.

---

## 🏗 1. The "Golden Stack" (Architecture)
Don't reinvent the wheel. Use this proven combination for speed, stability, and scale.

### **Frontend**
- **Framework**: React Native (via **Expo** Managed Workflow).
- **Routing**: `expo-router` (File-based routing, easy deep links).
- **Styling**: `StyleSheet` + Custom Design Tokens (Colors, Spacing) + `expo-linear-gradient` + `expo-blur`.
- **State**: React Context (Simple, no Redux bloat).
- **Storage**: `AsyncStorage` (Cache) + `SecureStore` (Tokens).

### **Backend & BaaS (Backend-as-a-Service)**
- **Auth & Database**: **Supabase**.
    - *Why*: Free tier is generous. Handles Auth (Email + Apple), Database (Postgres), and Storage (Images) in one place.
- **API Logic**: **Node.js / Express** on **Render.com**.
    - *Why*: Simple to deploy. Keeps business logic secure. Easy to scale.
- **Payments**: **RevenueCat**.
    - *Why*: Handles all the Apple/Google receipt validation mess. One dashboard for all subscription logic.

---

## 🛠 2. Account Setup Checklist (The "Boring" Stuff)
Do this first for every new project.

1.  **Apple Developer Account** ($99/year): Required for App Store.
2.  **GitHub**: Create a private repo.
3.  **Expo.dev**: Sign up (Free). Create a project.
4.  **Supabase**: Create a new project.
    - Copy: `SUPABASE_URL`, `SUPABASE_ANON_KEY`.
    - Enable **Auth Providers**: Email (Link) and Apple (Beta).
5.  **Render.com**: Connect GitHub repo.
    - Create "Web Service" (Node).
    - Set Environment Variables (Supabase keys, OpenAI keys).
6.  **RevenueCat**: Create a new project -> Add iOS App & Android App.
    - generate **Public API Key** (`appl_...` for iOS, `goog_...` for Android).
    - Define **Entitlements** (`pro`) and **Offerings** (`default`).
7.  **Sentry**: Create project (React Native).
    - Copy DSN for error tracking.
8.  **Google Play Console** ($25 one-time): Required for Play Store.
    - Create Payments Profile (Individual).
    - Verify Identity (takes 48h).

---

## 🎨 3. The "Premium Polish" System
How to make an MVP feel like a V10 product.

### **A. Design Language (Glassmorphism)**
- **Backgrounds**: Never use flat colors. Use `LinearGradient` (Deep Dark Blue -> Black).
- **Cards**: Use `<BlurView>` (Glass) with `rgba(255,255,255,0.1)` border.
- **Typography**: Large, bold Headers. Muted subtitles (`Colors.text.muted`).

### **B. Interaction**
- **Haptics**: Fire `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)` on *every* significant tap.
- **Animations**:
    - **Loading**: Never show a boring spinner. Use a custom loop (e.g., "CookingLoader" with emojis) or Skeleton text.
    - **Transitions**: Native Stack animations (default in Expo Router).

### **C. Empty States**
- Never leave a screen blank.
- "No Plans?" -> Show a button: "Generate your first plan!"

---

## 🚀 4. The Development Workflow

### **Phase 1: Scaffolding**
1.  `npx create-expo-app@latest my-app`.
2.  Copy `deploy_ios.sh` from Meal Planner.
3.  Copy `frontend/design/` (Colors, Typography) to new project.
4.  Setup `_layout.js` with `Sentry`, `PlanContext` (or `AuthContext`), and `ThemeProvider`.

### **Phase 2: Core Loop**
1.  Build the **Main Feature** first (e.g., "Generate Plan").
2.  Mock the data initially.
3.  Connect to Supabase later.

### **Phase 3: Monetization (Day 1)**
1.  Implemented `PaywallModal.js` immediately.
2.  Wrap the "Best Feature" in a check: `if (!isPro && count > limit) showPaywall()`.
3.  Don't wait until the end to add payments.

---

## 🚢 5. The Release Pipeline (Submission)

### **A. iOS (App Store)**
1.  **Preparation**:
    - Update `app.json`: Increment `ios.buildNumber`.
    - Check `.env`: Ensure Prod Keys are set.
2.  **The Script**:
    - Run `./deploy_ios.sh --local`.
    - This bumps version, builds `.ipa`, and uploads to TestFlight.
3.  **App Store Connect**:
    - Select Build -> Submit for Review.
    - Response time: ~24-48 hours.

### **B. Android (Google Play Store)**
1.  **Preparation (First Run)**:
    - Get RevenueCat Android API Key (`goog_...`).
    - Add to `.env`: `EXPO_PUBLIC_RC_KEY_ANDROID`.
    - Upload secret to Cloud: `eas secret:create --scope project --name EXPO_PUBLIC_RC_KEY_ANDROID --value <KEY>`.
    - Update `app.json`: Ensure `android.package`, `android.versionCode`, and `android.adaptiveIcon` are set.
2.  **Build**:
    - Run: `eas build --platform android --profile production`.
    - *Note*: This generates an `.aab` (Android App Bundle).
3.  **Google Play Console**:
    - Go to **Release > Testing > Internal testing**.
    - Create Release -> Upload `.aab`.
    - **Critical**: You MUST have a Payments Profile created (even for free apps with IAP) or IAP testing will fail.
    - Add testers by email list.
4.  **Store Listing**:
    - Unlike iOS, Internal Testing requires a draft Store Listing (Short Description + Full Description) before first upload.

---

## 🧠 6. Lessons Learned (Avoid these mistakes)
- **Env Vars**: EAS Build does *not* automatically read local `.env`. Always use `eas secret:push` OR fallback values in code (carefully).
- **Android Payments**: You cannot test IAP on Android without a valid Payments Profile in Google Play Console. Even if the app builds, the Paywall will crash without it.
- **Review Fallbacks**: Apple Reviewers might be on IPv6 or weird networks. Ensure API has robust timeouts and fallbacks (like we added for `API_URL`).
- **Simplicity**: Do less, but resolve it better. The "Cooking Animation" added more value than 10 extra features would have.

---
**Ready to build the next one? Copy this folder and start hacking.** 🛠️
