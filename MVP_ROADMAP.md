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
- [ ] **Navigation**: Implement a proper navigation library (e.g., `expo-router` or `react-navigation`) instead of conditional rendering (`if view === 'INPUT'`).

## 🛠 Phase 2: Quality Assurance & Standards (High Priority)
Before adding complexity, we must ensure the application is stable.
- [ ] **Fix Frontend Tests**: Resolve failing Jest tests in the frontend. Ensure the generated snapshot tests passed.
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
    - [ ] Add Middleware to protect `/api/plan` (Node.js backend is still public).
    - [ ] Implement Rate Limiting to prevent API abuse.
    - [ ] Add Input Validation (e.g., using `Joi` or `Zod`) to prevent bad data injection.
- [x] **Frontend Auth Flow**:
    - [x] Create Login & Sign Up Screens.
    - [x] Implement Secure Storage (Supabase Client).

## 💾 Phase 4: Persistence & Features
- [x] **Save Plan Feature**: Allow users to "Save" a generated plan to their profile.
- [x] **Load Plan Feature**: Restore the user's active plan when the app launches.
- [ ] **Offline Mode**: Cache the current plan locally (`AsyncStorage`) so the app works without internet (optional but good).
- [ ] **Reset Password API**: Basic account recovery flow.

## 🚀 Phase 5: Production Readiness
- [ ] **Environment Variables**: Move `API_HOST` and DB credentials to `.env` files (Do not hardcode IP addresses).
- [ ] **Error Handling**: Add global error boundaries to prevent "White/Red Screen of Death".
- [ ] **Assets**: Generate proper App Icon and Splash Screen.

## 📣 Phase 6: User Feedback & Analytics
- [ ] **Feedback Mechanism**: Add a "Send Feedback" form or button within the app settings.
- [ ] **Analytics**: Integrate a privacy-friendly analytics tool (e.g., PostHog or Amplitude) to track feature usage (e.g., "Do users actually use the Swap button?").
- [ ] **Beta Testing Group**: Establish a small group of test users to validate the "MVP" value proposition.
