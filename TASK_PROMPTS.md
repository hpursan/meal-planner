# Professional Implementation Task Prompts

This document contains detailed prompts to be executed by an AI Engineer to implement the Post-Launch Roadmap.
Each Prompt is designed to be executed in a single, focused session.

---

## 🚨 Prompt 1: Observability (Sentry Integration) (DONE)

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
4.  **Analytics Hook**:
    - When a user becomes Pro, identify them in PostHog (if integrated) or Sentry.

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

## 🧼 Prompt 4: Code Quality Automation (CI Implementation) (DONE)

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

---

## 🧪 Prompt 6: Test Engineering (Integration & E2E) (DONE)

**Role**: QA Automation Engineer
**Objective**: Increase test coverage for critical user flows.

**Context**:
We have Unit Tests (`planner.test.js`) and basic Component Tests (`AppRNTL.test.js` was deleted).
We added `frontend/app/__tests__/AuthIntegration.test.js`.

**Requirements**:
1.  **Maintain Integration Tests**:
    - Ensure `AuthIntegration.test.js` continues to pass as we refactor.
2.  **New Features**:
    - When adding RevenueCat, add a test mocking the purchase flow.
3.  **Maestro (E2E) Setup** (Optional):
    - Create folder `.maestro`.
    - Create `login_flow.yaml`:
        - `appId: com.mealplanner.app`
        - `tapOn: "Sign In"`
        - `inputText: "test@example.com"`

**Definition of Done**:
- `npm test` runs cleanly.

---

## 🍳 Prompt 7: Dynamic Recipe Engine (Backend Architecture)

**Role**: Backend Architect
**Objective**: Move static recipe data from code (`planner.js`) to Database (Supabase) to enable dynamic updates and drip-feeding.

**Context**:
Currently, recipes are hardcoded in `backend/planner.js` or `data/recipes.js`. To add new recipes without re-deploying, we need them in SQL.

**Requirements**:
1.  **Database Schema**:
    - Create `recipes` table in Supabase.
    - Columns: 
        - `id` (uuid)
        - `title` (text)
        - `description` (text)
        - `ingredients` (jsonb)
        - `instructions` (jsonb)
        - `diet_tags` (text[])
        - `image_url` (text)
        - `is_premium` (boolean, default false)
        - `release_date` (timestamptz, default now()) -- CRITICAL for Drip Strategy
    - Enable RLS (Read Access: `release_date <= NOW()`).
2.  **Migration Script**:
    - Create `backend/scripts/migrate_recipes.js`.
    - Read the existing hardcoded recipes array.
    - `insert` them into the Supabase `recipes` table (idempotent check by title).
3.  **Refactor Planner**:
    - Modify `backend/planner.js` (specifically `generateMealPlan` function).
    - Instead of `const recipes = [...]`, use `await supabase.from('recipes').select('*').contains('diet_tags', [preference]).lte('release_date', new Date().toISOString())`.
    - Ensure `mealVariations` logic still works with DB objects.

**Definition of Done**:
- `generatePlan` API returns recipes fetched from Supabase.
- Table `recipes` is populated with initial data.
- Future-dated recipes are NOT returned by the API yet.

---

## 🤖 Prompt 8: Chef Bot (Batch Generator & Validator)

**Role**: AI Engineering Lead
**Objective**: Create a robust script to batch-generate recipes, VALIDATE them with an AI Critic, and schedule them for future release.

**Prerequisite**: Prompt 7 (Dynamic Recipe Engine) must be complete.

**Requirements**:
1.  **Script**: `backend/scripts/generate_batch.js`.
    - Flags: `--count n` (number of recipes), `--start-date YYYY-MM-DD`.
2.  **The "Chef" (Generator)**:
    - Loop n times.
    - Call OpenAI: "Create a unique [Diet] recipe... Output JSON."
3.  **The "Critic" (Validator)**:
    - **CRITICAL**: Before accepting the recipe, pass the JSON to a *second* OpenAI call.
    - System Prompt: "You are a Senior Food Scientist. Review this recipe. Check for: 1. Edibility. 2. Correct Diet Tags (e.g. Ensure Keto has no sugar). 3. Clarity. Reply 'VALID' or 'INVALID: [Reason]'."
    - Logic: If 'INVALID', discard and RETRY generation (up to 3 times).
4.  **The "Artist" (Image Gen)**:
    - If VALID, generate image using DALL-E 3.
    - Upload to Supabase Storage.
5.  **The "Scheduler" (Drip)**:
    - Calculate `release_date`. 
    - E.g. If generating 12 recipes, set dates to: Jan 1, Feb 1, Mar 1...
    - Insert into `recipes` table.
6.  **Logging**: Output a report: "Generated 12 recipes. 3 Rejected by Critic and re-generated."

**Constraint**: User will provide **OpenAI API Key**.

**Definition of Done**:
- Running `node generate_batch.js --count 5` creates 5 high-quality recipes in Supabase with future dates.
- The "Critic" logic is proven to reject bad recipes (can test by forcing a bad generation).
