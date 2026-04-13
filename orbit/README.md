# 🛰 O.R.B.I.T.
## Outbreak Reporting & Biological Intelligence Tracker
### *Tracking today for a healthier tomorrow*

> **orbithealth.com** — Real-time global disease surveillance dashboard

---

## Architecture Overview

```
orbit/
├── server/                     ← Node.js + Express API
│   ├── config/
│   │   └── dataSources.js      ★ THE TRANSLATOR — change API sources here ONLY
│   ├── routes/
│   │   ├── disease.js          ← Disease data endpoints (translator-aware)
│   │   └── auth.js             ← Google OAuth / Firebase Admin
│   └── index.js                ← Express app entry
│
└── client/                     ← React + Vite frontend
    └── src/
        ├── services/
        │   └── api.js          ← Client-side API service (schema-normalized)
        ├── context/
        │   └── AuthContext.jsx ← Firebase Google Auth context
        ├── hooks/
        │   └── useDisease.js   ← Data fetching hook
        ├── utils/
        │   └── format.js       ← Formatters + risk color helpers
        ├── pages/
        │   ├── LandingPage.jsx ← Public marketing page
        │   ├── AuthPage.jsx    ← Google Sign-In
        │   ├── DashboardPage.jsx ← Main data overview + country table
        │   ├── MapPage.jsx     ← Leaflet interactive outbreak map
        │   └── StatisticsPage.jsx ← Recharts analytics
        └── components/
            └── AppLayout.jsx   ← Sidebar navigation shell
```

---

## The Translator Pattern

The core innovation of ORBIT is the **data source translator** in `server/config/dataSources.js`.

Every external API is defined as a named source with:
1. A **provider** name (for documentation)
2. A **baseUrl** (the only thing you change to swap providers)
3. **Endpoint templates** (parameterized URL paths)
4. A **transform()** function that normalizes any provider's raw response into ORBIT's unified schema

**Example:** To swap COVID-19 data from disease.sh to a WHO API:
```js
// BEFORE
covid19: {
  provider: "disease.sh",
  baseUrl: "https://disease.sh/v3/covid-19",
  ...
}

// AFTER — zero changes anywhere else in the codebase
covid19: {
  provider: "WHO",
  baseUrl: "https://api.who.int/v1/disease",
  endpoints: { countries: "/global-statistics" },
  transform: (raw) => ({
    country: raw.countryName,   // WHO uses different field names
    cases:   raw.totalCases,    // ← normalized to ORBIT schema
    ...
  })
}
```

Every route, hook, and component downstream sees only the ORBIT unified schema — never raw API data.

---

## Quick Start

### Prerequisites
- Node.js 18+
- A Firebase project with Google Auth enabled

### 1. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Authentication → Google** sign-in method
4. In **Project Settings → General**, create a Web App → copy config for client `.env`
5. In **Project Settings → Service Accounts**, generate a new private key → use for server `.env`
6. Add `localhost` to **Authorized Domains** in Authentication settings

### 2. Server Setup
```bash
cd orbit/server
cp .env.example .env
# Fill in your Firebase Admin credentials in .env
npm install
npm run dev
# → API running at http://localhost:5000
```

### 3. Client Setup
```bash
cd orbit/client
cp .env.example .env
# Fill in your Firebase Web SDK config in .env
npm install
npm run dev
# → App running at http://localhost:3000
```

---

## API Endpoints

All endpoints return ORBIT unified schema — provider-agnostic.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/disease/sources` | Available disease keys |
| GET | `/api/disease/:disease/global` | Global aggregate stats |
| GET | `/api/disease/:disease/countries` | All countries, sorted by cases |
| GET | `/api/disease/:disease/country/:id` | Single country detail |
| GET | `/api/disease/:disease/historical?days=30` | Timeline data |
| GET | `/api/disease/:disease/continents` | Continent breakdown |
| POST | `/api/auth/verify` | Verify Firebase ID token |
| GET | `/api/auth/me` | Get current user profile |

**Disease keys:** `covid19` · `mpox` · `influenza`

---

## Adding a New Disease

1. Add an entry to `server/config/dataSources.js`:
```js
chikungunya: {
  provider: "ProMED",
  baseUrl: "https://api.promed.org/v1",
  endpoints: {
    countries: "/diseases/chikungunya/by-country",
  },
  transform: (raw) => ({
    country:  raw.countryName,
    cases:    raw.reportedCases,
    deaths:   raw.fatalities,
    // ... map to ORBIT schema
  }),
},
```

2. Add to `DISEASES` array in `DashboardPage.jsx`, `MapPage.jsx`, `StatisticsPage.jsx`

That's it. No other changes needed.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, React Router v6 |
| Styling | Pure CSS with design tokens (no Tailwind) |
| Charts | Recharts |
| Maps | Leaflet + react-leaflet |
| Backend | Node.js + Express |
| Auth | Firebase Authentication (Google) |
| Data | disease.sh (swappable via translator) |
| Caching | In-memory, 5-minute TTL |

---

## Deployment

### Frontend → Vercel / Netlify
```bash
cd client
npm run build
# Deploy dist/ folder
# Set VITE_API_URL=https://api.orbithealth.com/api in platform env vars
```

### Backend → Railway / Render / Fly.io
```bash
cd server
# Set all env vars in platform dashboard
# Start command: node index.js
```

### Domain Setup
- Point `orbithealth.com` → frontend deployment
- Point `api.orbithealth.com` → backend deployment
- Update `CLIENT_ORIGIN` in server `.env` to `https://orbithealth.com`
- Update Firebase authorized domains to include `orbithealth.com`

---

*Built with the ORBIT Translator Pattern — flexible, reliable, future-proof.*
