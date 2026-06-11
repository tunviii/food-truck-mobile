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

Welcome to the Wok and Roll app — a tasty Expo + Node backend starter. This README is mildly opinionated, somewhat spicy, and packed with clickable badges so you can poke the project and see what happens.

--

## Quick menu (interactive)

- **Click badges** above to explore: Expo docs, npm, or your local API health endpoint.
- **Try the app**: run the frontend and backend locally and check the API health badge to see the backend respond.

## Get started

1. Install dependencies

```bash
npm install
```

2. Run the backend (in one terminal)

```bash
npm run api:dev
# or: npm run api:start
```

3. Run the frontend (in another terminal)

```bash
npm start
# or: npx expo start
```

4. Peek at the API health (or click the badge)

```bash
curl http://localhost:4000/health
```

If the health badge shows "200 OK", your backend is up and wagging its tail.

## What you'll find in this repo

- `app/` — the Expo app (routes, screens, components)
- `backend/` — Express + TypeScript API (models, routes, services)
- `assets/`, `src/`, `components/` — assets and shared UI pieces

> Tip: open the `backend` folder and try `npm run dev` there to run only the API.

## Commands

- Start frontend: `npm start`
- Start backend (dev): `npm run api:dev`
- Build backend: `npm run api:build`
