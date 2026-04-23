# O.R.B.I.T. — Outbreak Reporting & Biological Intelligence Tracker 
### *Tracking Today For A Healthier Tomorrow*
> **orbitdetection.com** 
## Overview
> The system is a web-based platform designed to detect, monitor, and present real-time data related to outbreaks and biological events. It integrates external APIs, a backend server, and a database to provide users with up-to-date information through an interactive and responsive interface. The platform users to securely access, analyze, and visualize health-related data, supporting informed decision-making through efficient data processing and responsive design.
---

## System Architecture Diagram

```
orbit/                             - Project Root (O.R.B.I.T. - Outbreak Reporting & Biological Intelligence Tracker)
├── client/                        - React + Vite frontend (Client SPA)
│   ├── public/                    - Static assets
|   |   ├── eye.png                - Hide password icon
│   │   ├── favicon1.png           - App favicon
│   │   ├── logo.png               - Website logo
│   │   └── show.png               - Show password icon
│   ├── src/                       - Core application source
│   │   ├── components/            - Reusable visual components
│   │   │   ├── layout/            - Application shell elements
│   │   │   │   ├── Footer.jsx     - Footer component
│   │   │   │   ├── Header.jsx     - Header navigation status bar
│   │   │   │   ├── Sidebar.jsx    - Primary dashboard navigation
│   │   │   │   └── index.js       - Component exporter shell
│   │   │   ├── ui/                - Domain-specific widgets
│   │   │   │   ├── CountryDetail.jsx - Detailed report drawer
│   │   │   │   ├── CountryTable.jsx  - Outbreak reporting data table
│   │   │   │   ├── DiseaseTabs.jsx   - Disease selection interface
│   │   │   │   ├── index.js          - Component exporter shell
│   │   │   │   ├── RiskBadge.jsx     - Color-coded risk level badge
│   │   │   │   ├── Skeleton.jsx      - Loading placeholder component
│   │   │   │   └── StatCard.jsx      - Data analytics metric card
│   │   │   └── AppLayout.jsx      - Protected Layout Composer & Route shell
│   │   ├── context/               - Global state management
│   │   │   └── AuthContext.jsx    - Firebase Google Auth context
│   │   ├── hooks/                 - Custom logic hooks
│   │   │   └── useDisease.js      - Disease data fetching & processing hook
│   │   ├── pages/                 - Main router page components
│   │   │   ├── AuthPage.jsx       - Google Sign-In portal
│   │   │   ├── DashboardPage.jsx  - Main data overview & country table
│   │   │   ├── LandingPage.jsx    - Public marketing entry page
│   │   │   ├── MapPage.jsx        - Leaflet interactive outbreak map
│   │   │   └── StatisticsPage.jsx - Recharts data analytics visualization
│   │   ├── services/              - Infrastructure services
│   │   │   └── api.js             - Client-Side HTTP Boundary
│   │   ├── styles/                - CSS & Asset files
│   │   │   ├── global.css         - Application-wide CSS variables & overrides
│   │   │   └── [...backgrounds]   - Background asset images 
│   │   ├── utils/                 - Helper functions
│   │   │   ├── countryCoordinates.js - Geo-data for Leaflet Map
│   │   │   └── format.js          - Data formatters & risk level helpers
│   │   ├── App.jsx                - React main shell & Route provider
│   │   ├── main.jsx               - React DOM entry point
│   ├── index.html                 - HTML shell entry
│   ├── package.json               - Vite, React, & UI dependency config
│   ├── vercel.json                - Vercel deployment configuration
│   └── vite.config.js             - Vite build & server config
│
├── server/                        - Node.js + Express API (Server API)
│   ├── config/                    - API source adapters
│   │   └── dataSources.js         - Server-Side Translator 
│   ├── routes/                    - API endpoint controllers
│   │   ├── auth.js                - Security, Google OAuth, & Firebase Admin
│   │   └── disease.js             - Outbreak data endpoints (translator-aware)
│   ├── index.js                   - Express entry point (Server Entry)
│   ├── package.json               - Express, helmet, cors, rate-limit dependency config
│   └── .gitignore                 - Git exclusion patterns for server secrets
│
└── README.md                      - Project Documentation 

```

## API Documentation

This describes the API endpoints used in the O.R.B.I.T. system. The API provides disease data retrieval and user authentication functionalities.

---

### Base URL

```
https://orbitdetection.com/api
```

---

### Disease Data API

The Disease API provides real-time and historical data for different diseases. It integrates external data sources and computes risk scores automatically.

---

### Get Available Sources

**GET** `/sources` - Returns all supported disease data sources.

#### Response

```json
{
  "sources": [
    {
      "key": "covid19",
      "provider": "External API",
      "label": "COVID-19",
      "dataType": "real-time",
      "endpoints": ["global", "countries", "country", "historical"],
      "hasDeathRate": false
    }
  ]
}
```

---

### Get Global Data

**GET** `/:disease/global` - Returns global statistics for a specific disease.

#### Example

```
GET /covid19/global
```

#### Response

```json
{
  "cases": 1000000,
  "deaths": 50000,
  "recovered": 900000,
  "active": 50000
}
```

---

### Get All Countries Data

**GET** `/:disease/countries` - Returns a list of countries with disease data.

#### Example

```
GET /covid19/countries
```

#### Response

```json
[
  {
    "country": "Philippines",
    "cases": 500000,
    "risk": "High",
    "riskScore": 0.8
  }
]
```

---

### Get Single Country Data

**GET** `/:disease/country/:id`- Returns data for a specific country.

#### Example

```
GET /covid19/country/PH
```

#### Response

```json
{
  "country": "Philippines",
  "cases": 500000,
  "deaths": 10000,
  "risk": "High"
}
```

---

### Get Historical Data

**GET** `/:disease/historical`

Returns historical disease data.

#### Query Parameters

* `days` (optional) – number of days (default: 365)
* `entity` (optional) – used for non-legacy diseases (default: World)

#### Example

```
GET /covid19/historical?days=30
```

---

### Get Continent Data

**GET** `/:disease/continents` - Returns aggregated data per continent.

#### Notes

* Available only for legacy data sources (e.g., COVID-19)

---

### Get Death Rate

**GET** `/:disease/deathrate` - Returns death rate data if available.

#### Notes

* Not available for COVID-19
* Can be computed from case data if needed

---

### Cache Statistics

**GET** `/cache/stats` - Returns cache information.

#### Response

```json
{
  "legacyCacheEntries": 10
}
```

---

### Authentication API 

Handles user authentication using JSON Web Tokens (JWT).

---

### Verify Token

**POST** `/auth/verify` - Verifies a user token and returns user details.

### Request Body

```json
{
  "idToken": "your_jwt_token"
}
```

### Response

```json
{
  "uid": "12345",
  "email": "user@email.com",
  "name": "John Doe",
  "picture": "profile.jpg",
  "role": "viewer"
}
```

---

### Get Current User

**GET** `/auth/me` - Returns the currently authenticated user.

#### Headers

```
Authorization: Bearer your_jwt_token
```

#### Response

```json
{
  "uid": "12345",
  "email": "user@email.com",
  "name": "John Doe"
}
```

---

### Error Responses

All endpoints may return the following error format:

```json
{
  "error": "Error message"
}
```

### Status Codes

* **400** – Bad Request
* **401** – Unauthorized
* **404** – Not Found
* **500** – Internal Server Error

---

## Database Schema

## Deployment Diagram
