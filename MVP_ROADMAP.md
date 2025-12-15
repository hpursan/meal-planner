# Meal Planner MVP Roadmap

This document tracks the progress towards the Minimum Viable Product (MVP).
**Goal**: A secure, robust, and persistent Meal Planner application ready for beta users.

## 📐 Guiding Principles
- **Best Practices First**: All implementation must adhere to industry standards (Clean Code, SOLID principles, proper error handling) rather than quick hacks.
- **Security by Design**: Security is not an afterthought; validated inputs and secure storage are mandatory.
- **User-Centricity**: Features are driven by actual user needs and feedback.

## ✅ Phase 1: Core Functionality (Completed)
- [x] **Project Scaffolding**: Setup React Native (Expo) frontend and Node.js backend.
- [x] **Meal Generation Logic**: Algorithm to create 7-day plans based on diet preferences.
- [x] **Meal Swapping**: Endpoint and UI to replace specific meals with alternatives.
- [x] **Shopping List**: Auto-generate ingredients list from the weekly plan.
- [x] **Shopping List Improvements**: "Hide Checked" toggle and ingredient detail view.
- [x] **Recipe Details**: Modal view with ingredients and step-by-step instructions.
- [x] **UI/UX**: Dark mode styling, custom gradients, and responsive layout.

## 🏗 Phase 1.5: Architecture Refinement (Critical)
To ensure the codebase doesn't become a "spaghetti" mess as we add features.
- [x] **Decouple App.js**: Split the 800-line file into smaller, focused components:
    - `components/MealPlanView.js`
    - `components/ShoppingListView.js`
    - `components/RecipeModal.js`
- [x] **Service Layer**: Extract all `fetch` calls (API logic) out of UI components into a dedicated `services/api.js` module.
- [x] **Navigation**: Implement a proper navigation library (`expo-router`) instead of conditional rendering.

## 🛠 Phase 2: Quality Assurance & Standards (High Priority)
Before adding complexity, we must ensure the application is stable.
- [x] **Fix Frontend Tests**: Resolve failing Jest tests in the frontend. Ensure the generated snapshot tests passed.
- [ ] **Backend Testing**: implementing unit tests for the planner logic (`planner.js`) to ensure algorithm correctness.
- [ ] **Linting & Formatting**: Standardize code style to prevent syntax errors (like the recent Reanimated crash).

## 🔐 Phase 3: Authentication & Security (Requirement)
Moving from a "toy app" to a real product requires User Accounts.
- [x] **Database Integration**:
    - [x] Choose DB (Supabase/PostgreSQL).
    - [x] Schema Design: `saved_plans` table.
- [x] **Backend Auth API**:
    - [x] Use Supabase Auth (SaaS) instead of custom Node.js.
- [ ] **Securing Endpoints**: 
- [x] **Securing Endpoints**: 
    - [x] Add Middleware to protect `/api/plan` (Node.js backend is still public).
    - [ ] Implement Rate Limiting to prevent API abuse.
    - [ ] Add Input Validation (e.g., using `Joi` or `Zod`) to prevent bad data injection.
- [x] **Frontend Auth Flow**:
    - [x] Create Login & Sign Up Screens.
    - [x] Implement Secure Storage (Supabase Client).

## 💾 Phase 4: Persistence & Features
- [x] **Save Plan Feature**: Allow users to "Save" a generated plan to their profile.
- [x] **Load Plan Feature**: Restore the user's active plan when the app launches.
- [x] **Persistent Shopping List**: Save checked items to database so state persists across reloads.
- [ ] **Offline Mode**: Cache the current plan locally (`AsyncStorage`) so the app works without internet (optional but good).
- [x] **Reset Password API**: Basic account recovery flow (Supabase integration).

## 📚 Phase 4.5: Plan Management (Completed)
- [x] **Plan History UI**: Create a "My Plans" screen to list all saved plans.
- [x] **Naming Plans**: specific input field to name a plan (e.g., "Keto Week 1") when generating or saving logic.
- [x] **Switch Plans**: Ability to load any previous plan from the list active view.

## 🎨 Phase 4.6: Visual & Data Enrichment (Completed)
- [x] **Recipe Images**: Add high-quality Unsplash images to all recipes for better UX.
- [x] **Ingredient Quantities**: Update backend data to include precise measurements (e.g., "1/2 cup").
- [x] **Recipe Card Polish**: Hero image in modal and better formatting.
- [x] **Data QA**: Audit and fix all missing or incorrect images/data.
- [x] **Local Image Hosting**: Transitioned ALL recipes to self-hosted images (downloaded Unsplash assets + custom AI images) to eliminate external dependencies/broken links.
- [x] **Shopping List UX**: Enhanced usage details with inline accordion expansion and "Smart Fallback" for images.

## 🚀 Phase 5: Production Readiness
- [x] **Cloud Deployment**: Backend on Render (Node), Frontend on Render (Web Static).
- [x] **Environment Variables**: Move `API_HOST` and DB credentials to `.env` files.
- [ ] **Error Handling**: Add global error boundaries to prevent "White/Red Screen of Death".
- [ ] **Assets**: Generate proper App Icon and Splash Screen.
- [ ] **Domain Registration**: Register a custom domain (e.g., getmealplanner.com) and configure SSL/DNS correctly.
- [ ] **Native Mobile Apps**: Build and release `.ipa` (iOS) and `.apk` (Android) binaries using EAS Build.

## 📣 Phase 6: User Feedback & Analytics
- [ ] **Feedback Mechanism**: Add a "Send Feedback" form or button within the app settings.
- [ ] **Analytics**: Integrate a privacy-friendly analytics tool (e.g., PostHog or Amplitude) to track feature usage (e.g., "Do users actually use the Swap button?").
- [ ] **Beta Testing Group**: Establish a small group of test users to validate the "MVP" value proposition.

## 💰 Phase 7: Monetization
- [ ] **Strategy**: Define Freemium vs Pro tiers.
- [ ] **Payments**: Integrate RevenueCat/Stripe for subscription handling.
- [ ] **Gate Features**: Lock advanced features (e.g., >3 day plans, offline mode) behind the Paywall.
