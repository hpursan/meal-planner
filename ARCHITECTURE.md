# Meal Planner Architecture

This document describes the technical architecture of the Meal Planner application, encompassing the Expo frontend, Node.js backend, and Supabase integration.

## 1. High-Level Overview

The application is a **Client-Server** architecture:
*   **Frontend**: A cross-platform mobile/web app built with **Expo (React Native)**.
*   **Backend**: A lightweight **Node.js/Express** API that handles the "Business Logic" (generating meal plans, enforcing dietary rules).
*   **Infrastructure**: **Supabase** handles Authentication and Database persistence. **Render** hosts the backend and web frontend.

```mermaid
graph TD
    User((User)) -->|Interacts| Frontend[Expo Frontend]
    Frontend -->|Auth & Save Plans| Supabase[Supabase (Auth + DB)]
    Frontend -->|req: Generate Plan| Backend[Node.js Backend]
    Backend -->|Verifies Token| Supabase
    Backend -->|Returns JSON| Frontend
```

## 2. Frontend (Expo / React Native)

A unified codebase running on iOS, Android, and Web.

*   **Framework**: React Native with Expo SDK.
*   **Routing**: `expo-router` for file-based navigation.
*   **State Management**: React `useState` / props (Simple state for MVP).
*   **Styling**: `StyleSheet` (Standard React Native).

### Key Components
*   **Auth.js**: Handles Login/Signup using Supabase Auth (Email + Google OAuth). Uses `expo-web-browser` for robust mobile OAuth flows.
*   **MealPlanView.js**: Displays the 3-meal daily view. Uses `SmartImage` to fallback gracefully if assets fail.
*   **ShoppingListView.js**: parsing logic to aggregate ingredients from the weekly plan. Features inline checking and usage details.

### Services (`frontend/services/`)
*   **`supabase.js`**: Initialized Supabase client. Uses `AsyncStorage` for persisting sessions on mobile.
*   **`api.js`**: Facade for Backend API calls. Automatically injects the `Authorization: Bearer <token>` header for security.

## 3. Backend (Node.js / Express)

A stateless API service responsible for the core algorithmic complexity.

*   **Runtime**: Node.js.
*   **Framework**: Express.js.
*   **Hosting**: Render.

### API Endpoints
| Method | Path | Protected? | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | No | Health check. Returns 200 OK. |
| `POST` | `/api/plan` | **Yes** | Generates a N-day meal plan based on preferences (e.g., "Vegan"). |
| `POST` | `/api/swap` | **Yes** | Returns a single meal alternative for a specific slot (e.g., "Swap Lunch"). |

### Core Logic (`backend/planner.js`)
*   Contains the `recipes` database (JSON array).
*   **Algorithm**:
    1.  Filters recipes by Diet (Vegan, Keto, etc.) and Restrictions ("No Pork").
    2.  Randomly selects Breakfast/Lunch/Dinner for N days.
    3.  Enforces "Meat-Free Days" logic (e.g., if Monday is meat-free, force Veg tags).

### Security
*   **Middleware**: `requireAuth` function extracts the Bearer token from headers and verifies it using `supabase.auth.getUser()`.
*   **Environment**: Secrets (`SUPABASE_ANON_KEY`) are loaded via `dotenv`.

## 4. Data Layer (Supabase)

### Authentication
*   **Providers**: Email/Password, Google OAuth.
*   **Tokens**: JWT Access Tokens (1 hour expiry) + Refresh Tokens.

### Database (PostgreSQL)
*   **Table**: `saved_plans`
    *   `id` (UUID, Primary Key)
    *   `user_id` (UUID, FK to auth.users)
    *   `name` (String, e.g., "Keto Week 1")
    *   `plan_data` (JSONB, stores the full generated plan structure)
    *   `created_at` (Timestamp)

## 5. Mobile & Build Pipeline

*   **Development**: `Expo Go` app via Tunnel/LAN (for instant refresh).
*   **Native Build** (Planned): `EAS Build` (Expo Application Services) to generate `.ipa` (iOS) and `.apk` (Android) binaries.
*   **OAuth on Mobile**: Uses `makeRedirectUri` and `WebBrowser.openAuthSessionAsync` to ensure the app catches the redirect callback after Google Sign-in.

## 6. Directory Structure

```
/
├── backend/
│   ├── server.js          # API Config & Middleware
│   ├── planner.js         # Algorithms & Data
│   ├── __tests__/         # Jest Unit Tests
│   └── public/images/     # Local visual assets
├── frontend/
│   ├── app/               # Screens (Expo Router)
│   ├── components/        # Reusable UI (Auth, Modals)
│   ├── services/          # API & Supabase Clients
│   └── assets/            # App Icons, Splash
└── ARCHITECTURE.md        # This file
```
