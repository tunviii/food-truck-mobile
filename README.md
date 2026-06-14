<!-- prettier-ignore -->
# 🍜 Wok and Roll

[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2056-38B2AC?logo=expo)](https://docs.expo.dev/versions/v56.0.0/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.85.3-61DAFB?logo=react&logoColor=white)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.19-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-%3E%3D4.0-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![npm](https://img.shields.io/badge/npm-uses-blue?logo=npm&logoColor=white)](https://www.npmjs.com/)
[![API Health](https://img.shields.io/website?url=http%3A%2F%2Flocalhost%3A4000%2Fhealth&label=api%20health)](http://localhost:4000/health)

Welcome to the Wok and Roll app — a tasty Expo + Node backend starter carved for food truck customers, admins, and kitchen staff.

---

## 🌟 What’s inside

- Customer mobile flow with:
  - menu browsing and category filters
  - add-to-cart, checkout, and order placement
  - live order tracking and pickup status
  - profile menu with avatar initials and sign-out
- Admin dashboard with:
  - menu item management
  - availability toggles and item editing
  - bottom navigation launcher for quick access
- Kitchen staff experience with:
  - live order queue
  - history view for completed orders
  - status updates for every order step
- Shared UX improvements:
  - bottom tab navigation with badges
  - improved tab spacing for easy tapping
  - role-aware screens and clean mobile-first UI
- Backend essentials:
  - Express + TypeScript API
  - JWT authentication
  - MongoDB persistence
  - request validation with Zod

## 🚀 Clone & run it

```bash
git clone https://github.com/<your-org>/food-truck-mobile.git
cd food-truck-mobile
npm install
```

### Backend secrets

Create a `backend/.env` file with at least:

```bash
MONGO_URI=mongodb://localhost:27017/foodtruck
JWT_SECRET=super-secret-key-at-least-24-characters
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
PORT=4000
```

> Tip: use a real MongoDB URI when you are not running locally.

### Frontend secrets

Create a root `.env` file with:

```bash
EXPO_PUBLIC_API_URL=http://localhost:4000/api
```

This tells the Expo app where to send API requests.

### Start the backend

```bash
npm run api:dev
```

### Start the mobile app

```bash
npx expo start
```

Then open the QR code in Expo Go or run on web, Android, or iOS.

## 🧪 Helpful project commands

- Clear metro bundler cache and start frontend: `npx expo start --clear`
- Start frontend: `npm start`
- Start backend (dev): `npm run api:dev`
- Start backend production: `npm run api:start`
- Build backend: `npm run api:build`

## 🗂️ Repo structure

- `app/` — Expo app routes, screens, and pages
- `src/` — UI components, hooks, providers, and feature logic
- `backend/` — API server code, routes, services, and config
- `assets/` — icons, images, and static assets

## 🎉 Play with it

- Browse the menu as a customer
- Switch to admin and manage menu items
- Watch kitchen staff move orders through the queue
- Check the API health badge to verify the backend

Have fun building and shipping this tasty mobile experience! 🍣🚚
