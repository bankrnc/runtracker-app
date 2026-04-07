# VeloStep — Frontend

React 19 frontend for the VeloStep running tracker app. AI-generated training programs, per-km run logging, health metrics, and session scoring.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 (with React Compiler) |
| Language | TypeScript |
| Routing | React Router v7 |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Styling | Tailwind CSS v4 |
| HTTP | Axios |
| Toasts | Sonner |
| Build | Vite |
| Package Manager | pnpm |

---

## Project Structure

```
src/
├── api/
│   └── programApi.ts         # API calls for programs/sessions
├── config/
│   └── apiClient.ts          # Axios instance (baseURL, withCredentials)
├── hooks/
│   └── useHealthMetrics.ts   # BMI, BMR, TDEE, macros, HR zones
├── layouts/
│   ├── Header.tsx            # Nav + mobile sidebar
│   ├── HeaderNotAuth.tsx     # Public header
│   ├── MainLayout.tsx
│   ├── ProtectedRoute.tsx
│   ├── PublicOnly.tsx
│   ├── SharedLayout.tsx
│   └── SplashScreen.tsx
├── pages/
│   ├── DashboardPage.tsx
│   ├── HealthPage.tsx        # BMI/BMR/TDEE/macros/HR zones
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ProfilePage.tsx       # Edit profile (wraps SetupProfilePage)
│   ├── ProfileViewPage.tsx   # View profile
│   ├── SetupProfilePage.tsx  # Profile setup form
│   ├── ProgramPage.tsx       # Program list + AI generate form
│   ├── ProgramDetailPage.tsx # Week tabs, session cards, log modal
│   ├── BlogPage.tsx
│   ├── AboutUsPage.tsx
│   └── FeaturePage.tsx
├── routes/
│   └── index.tsx             # createBrowserRouter config
├── schemas/
│   └── program.schema.ts     # Zod schemas + TS interfaces + color maps
└── store/
    └── useAuthStore.ts       # Zustand auth store
```

---

## Key Features

### AI Program Generation
- User inputs goal (free text), level, days/week, start date
- Backend calls Claude AI → returns 4-week structured JSON
- Each session has segments with pace/HR targets per km range

### Program Detail View
- Week tabs navigation
- Session cards showing segment plan (km range, pace, HR)
- Log Run modal — per-km table input (pace `M:SS`, HR bpm)
- Live score display after saving: score /10, avg pace, avg HR, distance

### Health Page
- Calculates BMI, BMR (Mifflin-St Jeor), TDEE, macros (25/50/25 split)
- HR zones (5 zones based on max HR)
- Requires complete profile (height, weight, DOB, gender, activity level)

### Auth
- JWT stored in httpOnly cookie (handled by backend)
- Zustand store holds user state client-side
- Protected routes redirect to login if not authenticated

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
# Install dependencies
pnpm install

# Set up environment variable
# Create .env file:
VITE_API_URL=http://localhost:8888

# Start dev server (port 5173)
pnpm dev
```

---

## Notes

- Uses **React Compiler** — no manual `useMemo`/`useCallback` needed
- Pace format: `M:SS` (e.g. `5:30`) — validated on submit before sending to API
- Dark theme only: `bg-black`, zinc palette, `lime-400` primary accent, `violet` for AI elements
