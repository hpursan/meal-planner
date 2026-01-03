# Meal Planner Post-Launch Roadmap (v1.1+)

**Goal**: Professionalize the infrastructure, ensure stability at scale, and implement monetization.

## 🚨 Phase 1: Stability & Observability (Critical)
*Foundational work required before aggressive user acquisition.*

- [x] **Crash Reporting (Sentry)**:
    - critical for catching production crashes on user devices.
    - [x] Install `@sentry/react-native`.
    - [x] Wrap Root Component (`_layout.js`).
    - [x] Configure Source Maps automation.
- [ ] **Error Boundaries**:
    - [ ] Replace default "Red Screen" with a friendly "Something went wrong" UI.
    - [ ] Add "Report to Support" button in the Error Boundary.
- [ ] **Code Quality**:
    - [ ] **Linting**: Enforce `eslint` rules in CI/CD (Github Actions).
    - [ ] **Formatting**: Enforce `prettier` standards.
    - [ ] **Types**: Consider gradual migration to TypeScript for core services.

## 💰 Phase 2: Monetization (Business Goal)
*Turning the free tool into a business.*

- [x] **RevenueCat Integration**:
    - [x] Setup Project in RevenueCat.
    - [x] Integrate `react-native-purchases`.
- [x] **Paywall UI**:
    - [x] Design "Pro" plan features (e.g., Plans > 3 days, Unlimited Swaps).
    - [x] Implement Subscription Screen/Modal.
    - [x] Implement "Restore Purchases".

## 📈 Phase 3: Growth & Analytics
- [ ] **Analytics (PostHog)**:
    - [ ] Track "Generated Plan" vs "Saved Plan" conversion.
    - [ ] Track Retention (Day 1, Day 7).
    - [ ] Track Feature Usage (Swap, Settings).
- [ ] **Marketing**:
    - [ ] **Domain**: Purchase `getmealplanner.com` (or similar).
    - [ ] **Landing Page**: Simple web landing page with App Store links.
    - [ ] **ASO**: Optimizing Keywords and Screenshots.

## 🧪 Phase 4: Advanced Features
- [ ] **Shopping List Sync**: Real-time sync between devices (requires RLS refinement).
- [ ] **Macro Tracking**: Calorie/protein counts (requires Data update).
- [ ] **Social Sharing**: Share plans via deep link.
