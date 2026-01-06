# Meal Planner MVP Roadmap

This document tracks the progress towards the Minimum Viable Product (MVP).
**Goal**: A secure, robust, and persistent Meal Planner application.
**Status**: **MVP COMPLETED (v1.0.2)**. See `POST_LAUNCH_ROADMAP.md` for v1.1.

## 📐 Guiding Principles
- **Best Practices First**: Clean Code, SOLID principles.
- **Security by Design**: Validated inputs, secure storage.
- **User-Centricity**: Features driven by user needs.

## ✅ Phase 1: Core Functionality (Completed)
- [x] **Project Scaffolding**: Setup React Native (Expo) frontend and Node.js backend.
- [x] **Meal Generation Logic**: Algorithm to create 7-day plans based on diet preferences.
- [x] **Meal Swapping**: Endpoint and UI to replace specific meals with alternatives.
- [x] **Shopping List**: Auto-generate ingredients list from the weekly plan.
- [x] **Shopping List Improvements**: "Hide Checked" toggle and ingredient detail view.
- [x] **Recipe Details**: Modal view with ingredients and instructions.
- [x] **UI/UX**: Dark mode styling, custom gradients, and responsive layout.

## ✅ Phase 1.5: Architecture Refinement (Completed)
- [x] **Decouple App.js**: Split into smaller components (`MealPlanView`, `ShoppingListView`).
- [x] **Service Layer**: Extract `fetch` calls to `services/api.js`.
- [x] **Navigation**: Implement `expo-router`.

## ✅ Phase 2: Quality Assurance (Completed)
- [x] **Frontend Tests**: Fixed failing Jest tests.
- [x] **Backend Testing**: Implemented unit tests for planner logic (`backend/tests/planner.test.js`).
- [ ] **Linting & Formatting**: Moved to Post-Launch (CI/CD).

## ✅ Phase 3: Authentication & Security (Completed - *Disabled for V1 Local-First*)
- [x] **Database Integration**: Supabase/PostgreSQL with `saved_plans` table.
- [x] **Backend Auth API**: Supabase Auth (SaaS).
- [x] **Securing Endpoints**: 
    - [x] Middleware to protect `/api/plan` (Configurable).
    - [x] Rate Limiting implemented.
    - [x] Input Validation (Days/Preferences).
- [x] **Frontend Auth Flow**:
    - [x] Login & Sign Up Screens.
    - [x] Apple Sign-In Integration.
    - [x] Secure Storage.

## ✅ Phase 4: Persistence & Features (Completed)
- [x] **Save Plan Feature**: Save to profile.
- [x] **Load Plan Feature**: Restore active plan.
- [x] **Persistent Shopping List**: Saved checked items.
- [x] **Offline Mode**: Local caching (`AsyncStorage`).
- [x] **Reset Password API**: Basic account recovery.

## ✅ Phase 4.7: Frontend Modernization (Completed)
- [x] **Design System**: `Colors`, `Typography`, tokens.
- [x] **UI Polish**: Fixed safe areas, buttons, haptics.
- [x] **Frontend Tests**: Fixed flaky integration tests.

## ✅ Phase 4.5: Plan Management (Completed)
- [x] **Plan History UI**: "My Plans" screen.
- [x] **Naming Plans**: Input field for plan names.
- [x] **Switch Plans**: Load previous plans.

## ✅ Phase 4.6: Visual & Data Enrichment (Completed)
- [x] **Recipe Images**: Hosted images.
- [x] **Ingredient Quantities**: Detailed data.
- [x] **Recipe Card Polish**: Hero images.
- [x] **Data QA**: Audited missing data.
- [x] **Shopping List UX**: Accordions and smart images.

## ✅ Phase 5: Production Readiness (Completed)
- [x] **Cloud Deployment**: Backend on Render.
- [x] **Environment Variables**: `.env` configuration.
- [x] **Assets**: App Icon and Splash Screen.
- [x] **Native Mobile Apps**: Built iOS `.ipa` (v1.0.2).
- [x] **App Store Launch**: Submitted to TestFlight.
- [ ] **Domain Registration**: Moved to Post-Launch.
- [ ] **Error Handling**: Moved to Post-Launch (Sentry).

## ✅ Phase 6: User Feedback (Completed)
- [x] **Feedback Mechanism**: Settings -> "Send Feedback" mailto link.
- [x] **Beta Testing Group**: TestFlight Internal Testing active.
- [ ] **Analytics**: Moved to Post-Launch.

## ✅ Phase 7: Monetization & Stability (Completed)
- [x] **RevenueCat Integration**: Wired up to App Store Connect.
- [x] **Paywall UI**: "Unlock Pro" modal with Restore functionality.
- [x] **Sentry**: Crash reporting integrated.
- [x] **UX Polish**: Added "Resume Plan" feature.
- [x] **Final Polish**: Pricing Strategy ($4.99/$29.99), Privacy Policy, Screenshots.
- [x] **App Store Submission**:
    - [x] Version 1.0 (Build 20) Submitted for Review.
    - [x] In-App Purchases (Monthly/Yearly) Submitted.

## 🚧 Phase 7.5: Content & Nutrition Sprint (In Progress - Pre-Launch)
- [ ] **Data Extraction**: Dump Supabase recipes to local JSON.
- [ ] **Enrichment**: Add Macros (Calories, Protein, Carbs) to all recipes.
- [ ] **Expansion**: Generate 30+ new recipes (Total ~60).
- [ ] **UI Update**: Show Macros in RecipeDetail (Blur/Lock for Non-Pro).
- [ ] **Final Build**: Build 21.

## 🚀 Phase 8: Post-Launch (Live Ops)
- [ ] **Monitor Review Status**: Respond to Apple rejections/questions.
- [ ] **First Sale**: Verify IAP flow in Production.
- [ ] **Marketing**: ASO Optimization, Social Media.
- [ ] **V1.1 Planning**:
    - [ ] **Automated Content Drip System**:
        - [ ] **Data Gen**: Pre-create 12+ months of recipes (Text + Images) using AI.
        - [ ] **Schema**: Add `release_date` or `month_index` to Recipe DB.
        - [ ] **Logic**: Update `planner.js` to filter available recipes based on `Current Date >= Release Date`.
    - [ ] Cloud Sync (Optional).
    - [ ] Nutritional Tracking.
    - [ ] Android Release.
