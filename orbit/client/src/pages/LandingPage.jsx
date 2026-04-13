import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TICKER_ITEMS = [
  "🦠 COVID-19 Global Surveillance Active",
  "📡 Real-time outbreak data from 195+ countries",
  "🧬 Mpox tracking enabled",
  "📊 Historical trend analysis — 90 day lookback",
  "🗺 Interactive outbreak heatmap",
  "⚡ Risk scoring across all nations",
  "🔬 WHO & CDC data integration",
];

export default function LandingPage() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="landing page-enter">
      <style>{`
        .landing {
          min-height: 100vh;
          background: var(--white);
          display: flex;
          flex-direction: column;
        }

        /* ── Ticker ── */
        .ticker {
          background: var(--gray-900);
          color: var(--orbit-green-light);
          font-family: var(--font-mono);
          font-size: .78rem;
          padding: .45rem 0;
          overflow: hidden;
          white-space: nowrap;
          letter-spacing: .03em;
        }
        .ticker-content {
          display: inline-flex;
          gap: 4rem;
          animation: ticker-scroll 30s linear infinite;
        }

        /* ── Hero nav ── */
        .lnav {
          padding: 1.25rem 5%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border);
          background: rgba(255,255,255,.92);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .lnav-brand {
          display: flex;
          align-items: center;
          gap: .75rem;
        }
        .lnav-logo {
          width: 42px; height: 42px;
          background: linear-gradient(135deg, var(--orbit-green), var(--orbit-green-dim));
          border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem;
          box-shadow: var(--shadow-green);
        }
        .lnav-title {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--gray-900);
          letter-spacing: .04em;
        }
        .lnav-sub {
          font-size: .7rem;
          color: var(--gray-400);
          font-family: var(--font-mono);
        }
        .lnav-actions { display: flex; gap: .75rem; align-items: center; }

        /* ── Hero ── */
        .hero {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 5rem 5% 4rem;
          position: relative;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 40% at 50% -10%, rgba(16,185,129,.08) 0%, transparent 70%),
            radial-gradient(ellipse 40% 30% at 80% 80%, rgba(16,185,129,.05) 0%, transparent 60%);
          pointer-events: none;
        }
        .hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(var(--gray-100) 1px, transparent 1px),
            linear-gradient(90deg, var(--gray-100) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent);
          pointer-events: none;
          opacity: .5;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: .5rem;
          background: var(--orbit-green-bg);
          border: 1px solid var(--border-em);
          color: var(--orbit-green-dim);
          padding: .3rem 1rem;
          border-radius: 99px;
          font-size: .8rem;
          font-weight: 600;
          font-family: var(--font-mono);
          margin-bottom: 1.75rem;
          letter-spacing: .03em;
        }
        .hero h1 {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 800;
          color: var(--gray-900);
          line-height: 1.08;
          max-width: 800px;
          margin-bottom: 1.25rem;
          letter-spacing: -.03em;
        }
        .hero h1 em {
          font-style: normal;
          color: var(--orbit-green);
        }
        .hero-tagline {
          font-size: 1.15rem;
          color: var(--gray-500);
          max-width: 560px;
          margin-bottom: 2.5rem;
          line-height: 1.7;
        }
        .hero-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 3.5rem;
        }
        .hero-stats {
          display: flex;
          gap: 3rem;
          flex-wrap: wrap;
          justify-content: center;
          padding-top: 2.5rem;
          border-top: 1px solid var(--border);
          position: relative;
          z-index: 1;
        }
        .hero-stat {
          text-align: center;
        }
        .hero-stat-num {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--gray-900);
          letter-spacing: -.04em;
          display: block;
        }
        .hero-stat-label {
          font-size: .8rem;
          color: var(--gray-400);
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: .06em;
        }

        /* ── Features ── */
        .features {
          padding: 5rem 5%;
          background: var(--gray-50);
          border-top: 1px solid var(--border);
        }
        .section-label {
          font-family: var(--font-mono);
          font-size: .75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .12em;
          color: var(--orbit-green);
          margin-bottom: .75rem;
        }
        .section-title {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          font-weight: 800;
          color: var(--gray-900);
          margin-bottom: 3rem;
          max-width: 500px;
          letter-spacing: -.02em;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.25rem;
        }
        .feature-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.75rem;
          transition: all .2s ease;
          position: relative;
          overflow: hidden;
        }
        .feature-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--orbit-green-bg), transparent);
          opacity: 0;
          transition: opacity .2s;
        }
        .feature-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-3px); border-color: var(--border-em); }
        .feature-card:hover::before { opacity: 1; }
        .feature-icon {
          width: 48px; height: 48px;
          background: var(--orbit-green-bg);
          border: 1px solid var(--border-em);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem;
          margin-bottom: 1rem;
          position: relative;
        }
        .feature-card h3 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--gray-900);
          margin-bottom: .5rem;
          position: relative;
        }
        .feature-card p {
          font-size: .875rem;
          color: var(--gray-500);
          line-height: 1.6;
          position: relative;
        }

        /* ── Footer ── */
        .landing-footer {
          padding: 2rem 5%;
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .landing-footer p {
          font-size: .8rem;
          color: var(--gray-400);
          font-family: var(--font-mono);
        }
        .footer-links { display: flex; gap: 1.5rem; }
        .footer-links a {
          font-size: .8rem;
          color: var(--gray-400);
          text-decoration: none;
          transition: color .15s;
        }
        .footer-links a:hover { color: var(--orbit-green); }

        @media (max-width: 600px) {
          .hero-stats { gap: 1.5rem; }
          .hero-actions { flex-direction: column; align-items: center; }
          .lnav-actions .btn-ghost { display: none; }
        }
      `}</style>

      {/* Ticker */}
      <div className="ticker">
        <div className="ticker-content">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i}>⬡ {item}</span>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav className="lnav">
        <div className="lnav-brand">
          <div className="lnav-logo">🛰</div>
          <div>
            <div className="lnav-title">O.R.B.I.T.</div>
            <div className="lnav-sub">orbithealth.com</div>
          </div>
        </div>
        <div className="lnav-actions">
          <a href="#features" className="btn btn-ghost">Features</a>
          <button className="btn btn-primary" onClick={() => navigate("/auth")}>
            🔐 Sign In
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />

        <div className="hero-badge" style={{ position:"relative", zIndex:1 }}>
          <span className="live-dot" />
          Real-time Global Disease Surveillance
        </div>

        <h1 style={{ position:"relative", zIndex:1 }}>
          The pulse of world health<br />
          <em>at your fingertips</em>
        </h1>

        <p className="hero-tagline" style={{ position:"relative", zIndex:1 }}>
          Tracking today for a healthier tomorrow. O.R.B.I.T. delivers live outbreak intelligence,
          interactive outbreak maps, and deep statistical analysis across 195+ countries.
        </p>

        <div className="hero-actions" style={{ position:"relative", zIndex:1 }}>
          <button className="btn btn-primary" style={{ padding:".875rem 2rem", fontSize:"1rem" }} onClick={() => navigate("/auth")}>
            🛰 Launch Dashboard
          </button>
          <a href="#features" className="btn btn-ghost" style={{ padding:".875rem 2rem", fontSize:"1rem" }}>
            Explore Features →
          </a>
        </div>

        <div className="hero-stats" style={{ position:"relative", zIndex:1, width:"100%", maxWidth:"700px" }}>
          {[
            { num: "195+", label: "Countries Tracked" },
            { num: "24/7", label: "Live Monitoring" },
            { num: "4",    label: "Disease Streams" },
            { num: "100%", label: "Open Data" },
          ].map(({ num, label }) => (
            <div className="hero-stat" key={label}>
              <span className="hero-stat-num">{num}</span>
              <span className="hero-stat-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <div className="section-label">Platform Capabilities</div>
        <div className="section-title">Everything you need to track global outbreaks</div>

        <div className="features-grid">
          {[
            { icon:"🗺", title:"Interactive Outbreak Map", desc:"Live heatmap across 195+ countries. Color-coded by risk level — critical to minimal. Drill down to country level detail with a single click." },
            { icon:"📊", title:"Statistical Deep Dive", desc:"Historical trend lines, continent comparisons, case fatality rates, and recovery trajectories — all updated every 5 minutes from live sources." },
            { icon:"⚡", title:"AI Risk Scoring", desc:"Every country receives a 0-100 risk score computed from case density, mortality rate, and active case trajectory. Updated in real time." },
            { icon:"🔄", title:"Multi-Disease Tracking", desc:"Switch between COVID-19, Mpox, Influenza and more. Built on an adapter pattern — add any new disease source without changing the codebase." },
            { icon:"🌐", title:"Country Detail View", desc:"Select any country for a full breakdown: total cases, daily new cases, deaths, recovery rate, risk tier, and population-adjusted metrics." },
            { icon:"🔐", title:"Secure Authentication", desc:"Google Sign-In powered by Firebase. Your session is secure and your data is private. Role-based access for researcher and admin levels." },
          ].map(({ icon, title, desc }) => (
            <div className="feature-card" key={title}>
              <div className="feature-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2025 O.R.B.I.T. — orbithealth.com · Outbreak Reporting & Biological Intelligence Tracker</p>
        <div className="footer-links">
          <a href="#features">Features</a>
          <a href="/auth">Sign In</a>
        </div>
      </footer>
    </div>
  );
}
