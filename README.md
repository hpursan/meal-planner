# Meal Planner App 🥗

An AI-powered meal planning application built with React Native (Expo) and Node.js.

## 🚀 Project Status
**Live in Review (v1.0.3)**.
See [ROADMAP.md](./ROADMAP.md) for detailed progress and future plans.

## 📂 Structure
- `frontend/`: React Native (Expo) application.
- `backend/`: Node.js/Express API (deployed on Render).
- `docs/`: Technical documentation and specifications.
  - [Architecture](./docs/ARCHITECTURE.md)
  - [Task Prompts](./docs/TASK_PROMPTS.md)
  - [QA Script](./docs/QA_TEST_SCRIPT.md)

## 🛠 Setup & Deployment
### 1. Installation
```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

### 2. Environment Variables
Ensure `.env` and `frontend/.env` are populated (see docs).

### 3. Deployment (iOS)
Use the automated deployment script:
```bash
./deploy_ios.sh --local
```
This builds the `.ipa` using EAS and upload it to TestFlight/App Store Connect.
