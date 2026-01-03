# 🚀 Final Launch Checklist

## ✅ Completed
- [x] **Backend DB:** Migrated to Supabase (27 Recipes).
- [x] **Backend Code:** Deployed to Render (Auto-deploy active).
- [x] **Monetization:** RevenueCat integrated with App Store configuration.
- [x] **Tax/Banking:** Forms submitted to Apple.
- [x] **Build:** Version 1.0.3 (3) includes all secrets.

## 🔜 Immediate Next Steps (Tonight)
1. **Wait for Build 3:** currently processing in EAS Cloud.
2. **Submit to Apple:** Run `npx eas-cli submit --platform ios` in `frontend/`.
3. **TestFlight:** Install v1.0.3 (3).
4. **Smoke Test:** Run the script in `QA_TEST_SCRIPT.md`.
    - *Crucial Check:* Does the "Upgrade" button show the Apple Purchase Sheet?

## 📅 Tomorrow / T+24h
1. **Check Banking:** Wait for "Paid Applications Agreement" to turn Active.
2. **Create IAP:** create `pro_monthly` etc. in App Store Connect -> In-App Purchases.
    - *Note:* Product ID MUST match what you put in RevenueCat.
3. **Submit for Review:**
    - Add the Build (1.0.3.3) to the "iOS App" version.
    - Add the In-App Purchase to the submission.
    - Click "Submit for Review".

## 🎉 Launch Day
- When Approved (usually 24h), verify production flow.
- Release "Pending Developer Release" -> **Release!**
