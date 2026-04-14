# StridePilot — Frontend

React 19 frontend for [StridePilot](https://stride-pilot.vercel.app), an AI-powered running training application. Includes AI program generation, per-km session logging, analytics dashboard, and health metrics calculator.

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript |
| Routing | React Router v7 |
| State Management | Zustand |
| Forms | React Hook Form + Zod |
| Styling | Tailwind CSS v4 |
| HTTP Client | Axios |
| Toasts | Sonner |
| Build Tool | Vite |
| Package Manager | pnpm |

---

## Features

- **AI Program Generation** — Input goal, fitness level, days/week, and personal best data → generates a 4-week structured training plan via Claude AI
- **Program Detail View** — Week tabs, session cards with pace/HR targets per km range, animated generating overlay
- **Session Logging** — Per-km log modal (pace M:SS + HR bpm), live score /10 after save
- **Analytics Dashboard** — HR zone distribution, session type breakdown, weekly progress
- **Health Calculator** — BMI, BMR (Mifflin-St Jeor), TDEE, macros, HR zones from profile data
- **Profile Management** — Edit info, upload avatar
- **Blog** — Read posts from admin
- **Authentication** — Register/Login with JWT httpOnly cookie, protected routes

---

## Project Structure

```
src/
├── api/
│   └── programApi.ts               # Program + session API calls
├── features/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   └── program/
│       └── ProgramPage.tsx         # Program list + AI generate form
├── layouts/
│   ├── Header.tsx                  # Nav with mobile burger menu
│   ├── HeaderNotAuth.tsx           # Public header
│   ├── MainLayout.tsx
│   ├── ProtectedRoute.tsx          # Redirect to login if not authenticated
│   ├── PublicOnly.tsx              # Redirect to /program if already logged in
│   └── SharedLayout.tsx
├── lib/
│   └── apiClient.ts                # Axios instance (baseURL: "/api", withCredentials)
├── pages/
│   ├── ProgramDetailPage.tsx       # Week tabs, session cards, log run modal
│   ├── DashboardPage.tsx
│   ├── HealthPage.tsx              # BMI/BMR/TDEE/macros/HR zones
│   ├── ProfilePage.tsx
│   ├── ProfileViewPage.tsx
│   ├── SetupProfilePage.tsx
│   ├── BlogPage.tsx
│   ├── FeaturePage.tsx
│   └── AboutUsPage.tsx
├── routes/
│   └── index.tsx                   # createBrowserRouter config
├── schemas/
│   └── program.schema.ts           # Zod schemas, TS types, session color maps
└── store/
    └── useAuthStore.ts             # Zustand auth store (user, login, logout)
```

---

## Deployment

The app is deployed on **Vercel** with API proxy rewrites to avoid cross-origin cookie issues (Safari ITP).

`vercel.json`:
```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://<railway-url>/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

All API requests use `baseURL: "/api"` — Vercel proxies them to Railway, keeping cookies same-origin.

---

## Session Types & Colors

| Type | Color |
|---|---|
| Easy Run | Lime |
| Tempo | Orange |
| Interval | Red |
| Long Run | Blue |
| Recovery | Zinc |
| Rest | Zinc (muted) |

---

## Getting Started

```bash
pnpm install
pnpm dev
```

> No environment variables needed locally — configure `vercel.json` proxy for production, or update `apiClient.ts` baseURL to point directly to your backend.

---

## Notes

- Dark theme only: `bg-black`, zinc palette, `lime-400` primary accent, `violet` for AI elements
- Pace format: `M:SS` (e.g. `5:30`)
- `font-size: 16px` on all inputs to prevent iOS auto-zoom
