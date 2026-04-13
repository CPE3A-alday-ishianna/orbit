/**
 * ORBIT Client API Service
 * ─────────────────────────────────────────────────────────────────────────────
 * All data calls go through here. The server translator normalizes the data,
 * so these methods always receive the ORBIT unified schema.
 *
 * If the backend URL changes, update API_BASE only.
 */
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

const http = axios.create({
  baseURL: API_BASE,
  timeout: 15_000,
});

// Attach auth token if available
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("orbit_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Disease API ───────────────────────────────────────────────────────────────
export const DiseaseAPI = {
  /** Fetch all available disease source keys */
  getSources: () => http.get("/disease/sources").then((r) => r.data),

  /** Global aggregate stats for a disease */
  getGlobal: (disease) =>
    http.get(`/disease/${disease}/global`).then((r) => r.data),

  /** All countries data — normalized + risk-scored */
  getCountries: (disease) =>
    http.get(`/disease/${disease}/countries`).then((r) => r.data),

  /** Single country detail */
  getCountry: (disease, countryId) =>
    http.get(`/disease/${disease}/country/${countryId}`).then((r) => r.data),

  /** Historical timeline */
  getHistorical: (disease, days = 30) =>
    http.get(`/disease/${disease}/historical?days=${days}`).then((r) => r.data),

  /** Continent breakdown */
  getContinents: (disease) =>
    http.get(`/disease/${disease}/continents`).then((r) => r.data),
};

// ── Auth API ──────────────────────────────────────────────────────────────────
export const AuthAPI = {
  verify: (idToken) =>
    http.post("/auth/verify", { idToken }).then((r) => r.data),
  me: () =>
    http.get("/auth/me").then((r) => r.data),
};
