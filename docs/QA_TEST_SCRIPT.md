# QA Smoke Test for Meal Planner (v1.0.3)

**Objective:** Verify core functionality and backend integration on a production build (TestFlight).

## 1. 🐣 First Run (Fresh Install)
- [ ] **Install:** Download from TestFlight.
- [ ] **Launch:** App opens without crashing.
- [ ] **Generate:**
    - Select "Vegan" (or any tag).
    - Enter `3` days.
    - Tap **Create Meal Plan**.
- [ ] **Verify:**
    - Loading spinner appears.
    - Plan loads successfully.
    - **Images:** Do food images appear? (Verifies Backend Connection).
    - **Tags:** Do meals look correct (e.g., no meat if Vegan)?

## 2. 📱 Core Usage
- [ ] **Recipe Details:**
    - Tap a meal.
    - Verify Ingredients list is populated.
    - Verify Instructions are readable.
- [ ] **Swap Meal:**
    - Tap the swap icon (refresh arrow) on a meal.
    - *Expected:* Meal changes to a different one.
- [ ] **Shopping List:**
    - Go to Shopping List tab.
    - Verify items are present and checkable.

## 3. 💰 Monetization (RevenueCat)
- [ ] **Trigger Paywall:**
    - Go to Generate screen.
    - Enter `7` days (Free limit is 3).
    - Tap Create.
    - *Expected:* **Paywall Modal** appears.
- [ ] **Purchase (Sandbox):**
    - Tap "Upgrade to Pro".
    - Confirm purchase (Apple Sandbox UI).
    - *Expected:* Success alert. Paywall closes.
- [ ] **Verify Pro Status:**
    - Go to Settings.
    - Status should allow "Restore Purchases" or show "Active".
    - Try to generate 7 days again. *Expected:* It works now.

## 4. ✈️ Offline Mode
- [ ] **Go Offline:** Enable Airplane Mode (Wifi OFF, Data OFF).
- [ ] **Kill App:** Swipe up to force close.
- [ ] **Re-launch:** Open app.
- [ ] **Verify:**
    - Plan is visible (loaded from cache).
    - Recipe details (text) work.
    - *Note:* Images might be missing if not cached (Normal).
- [ ] **Action:**
    - Try to Swap a meal.
    - *Expected:* Error / "Offline" message.

## 5. ⚙️ Settings
- [ ] **Links:** Test "Privacy Policy" and "Terms" buttons.
- [ ] **Restore:** Test "Restore Purchases" button.
