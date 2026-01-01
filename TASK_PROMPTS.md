# Professional Implementation Task Prompts

This document contains detailed prompts to be executed by an AI Engineer to implement the Post-Launch Roadmap.
Each Prompt is designed to be executed in a single, focused session.

---

## 🚨 Prompt 1: Observability (Sentry Integration)

**Role**: Senior React Native Engineer
**Objective**: Implement production-grade crash reporting using Sentry.

**Context**:
We are using Expo (Managed Workflow) with `expo-router`.
We need to capture unhandled JS errors and Native crashes.

**Requirements**:
1.  **Install**: Install `@sentry/react-native`.
2.  **Configure**:
    - Update `app.json` to include the Sentry plugin.
    - Set `organization`, `project`, and `url` (defaults usually fine) if needed, or rely on environment variables.
3.  **Initialize**:
    - Modify `frontend/app/_layout.js` (or entry point) to `Sentry.init()`.
    - Ensure `Sentry.wrap` wraps the root layout.
4.  **Source Maps**:
    - Verify `eas.json` or build scripts are configured to upload source maps on build (using `expo-updates` or Sentry wizard).
    - Note: For local builds (`npx expo prebuild`), ensure the Sentry plugin hooks into the build phase.

**Constraint**: Use the **USER PROVIDED DSN** (User will provide this at start of task).

**Definition of Done**:
- App builds successfully with Sentry linked.
- Manually triggering `Sentry.captureException(new Error("Test Code Crash"))` sends an event to the Sentry Dashboard.

---

## 💰 Prompt 2: Monetization Hook (RevenueCat)

**Role**: Senior Mobile Engineer
**Objective**: Integrate RevenueCat SDK (`react-native-purchases`) to handle subscriptions.

**Context**:
We plan to introduce a "Pro" usage tier (Limits > 3 day plans).

**Requirements**:
1.  **Install**: `react-native-purchases` and `expo-build-properties` (if native directives needed).
2.  **Service Layer**:
    - Create `frontend/services/purchases.js`.
    - Implement `init()`: Initialize SDK with API Key.
    - Implement `getCustomerInfo()`: Check current subscription status.
    - Implement `purchasePackage()`: Trigger the native purchase flow.
3.  **Global State**:
    - Update `PlanContext.js` (or new `AuthContext.js`) to track `isPro` status.
    - On app launch, check entitlement status and update context.

**Constraint**: Use the **USER PROVIDED REVENUECAT PUBLIC API KEY**.

**Definition of Done**:
- App initializes Purchases SDK on launch without error.
- `isPro` state is available in the app context.

---

## 💰 Prompt 3: Paywall UI & Entitlement Logic

**Role**: React Native UX Engineer
**Objective**: Create the UI to sell the Pro Plan and enforce limits.

**Context**:
Users are limited to 3-day plans unless they are "Pro".

**Requirements**:
1.  **Paywall Screen**:
    - Create `frontend/components/PaywallModal.js`.
    - Design: "Unlock Full Meal Planner" header, "Unlimited Days", "Unlimited Swaps".
    - Buttons: "Subscribe for $X.XX/mo" (Dynamic price from RevenueCat package) and "Restore Purchases".
    - Footer: Terms of Service & Privacy Policy links.
2.  **Enforcement**:
    - In `frontend/app/index.js` (Generate Plan), check `isPro`.
    - If `days > 3` and `!isPro`, show the Paywall Modal instead of generating.
    - Do not hardcode the check; use the Context state.
3.  **UI Polish**: Use `LinearGradient` and existing Design System tokens (`Colors.ts`).

**Definition of Done**:
- Selecting 7 days as a free user triggers the Paywall.
- The Paywall displays correct product information (mocked if necessary for dev).
- Restoring purchases works.

---

## 🧼 Prompt 4: Code Quality Automation (CI Implementation)

**Role**: DevOps / Lead Engineer
**Objective**: Enforce code standards to prevent regressions.

**Requirements**:
1.  **Linting**:
    - Ensure `.eslintrc.js` is correctly configured for Expo/React Native.
    - Add script `"lint": "eslint ."` to `package.json`.
    - Fix currently outstanding lint errors (auto-fix where possible).
2.  **Formatting**:
    - Add `prettier` config.
    - Add script `"format": "prettier --write ."`.
3.  **CI Workflow**:
    - Create `.github/workflows/ci.yml`.
    - Steps: Checkout -> Setup Node -> Install Deps -> Lint -> Run Tests (`npm test`).

**Definition of Done**:
- Running `npm run lint` locally works.
- A Github Action exists that will protect the `master` branch in future.

---

## 📈 Prompt 5: Analytics (PostHog)

**Role**: Data Engineer
**Objective**: capture user behavior to guide product decisions.

**Requirements**:
1.  **Install**: `posthog-react-native`.
2.  **Initialize**: In `_layout.js` with API Key.
3.  **Instrumentation**:
    - Auto-capture screen views (Expo Router integration).
    - Manually capture key events: `plan_generated` (properties: days, preferences), `plan_saved`, `meal_swapped`.

**Constraint**: User will provide PostHog API Key.

**Definition of Done**:
- Events are logged to console (in debug mode).
