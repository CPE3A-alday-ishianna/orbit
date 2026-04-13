import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDisease } from "../hooks/useDisease";
import { fmt, riskColor } from "../utils/format";
import { useAuth } from "../context/AuthContext";

const DISEASES = [
  { key: "covid19",      label: "COVID-19",     icon: "🦠", color: "#3b82f6" },
  { key: "mpox",         label: "Mpox",         icon: "🧬", color: "#8b5cf6" },
  { key: "influenza",    label: "Influenza",    icon: "🌡", color: "#f59e0b" },
  { key: "tuberculosis", label: "Tuberculosis", icon: "🫁", color: "#7c3aed" },
  { key: "dengue",       label: "Dengue",       icon: "🦟", color: "#d97706" },
  { key: "cholera",      label: "Cholera",      icon: "💧", color: "#0891b2" },
  { key: "measles",      label: "Measles",      icon: "⚕️", color: "#db2777" },
];

function StatCard({ label, value, sub, accent, loading }) {
  return (
    <div className="card stat-card">
      <style>{`
        .stat-card {
          display: flex;
          flex-direction: column;
          gap: .5rem;
          padding: 1.25rem 1.5rem;
          border-left: 3px solid var(--accent, var(--orbit-green));
        }
        .stat-card-label {
          font-size: .75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .07em;
          color: var(--gray-400);
          font-family: var(--font-mono);
        }
        .stat-card-val {
          font-family: var(--font-display);
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--gray-900);
          letter-spacing: -.03em;
          line-height: 1;
        }
        .stat-card-sub {
          font-size: .8rem;
          color: var(--gray-400);
        }
        .skel-val { height: 2rem; width: 7rem; }
      `}</style>
      <style>{`.stat-card { --accent: ${accent || "var(--orbit-green)"}; }`}</style>
      <div className="stat-card-label">{label}</div>
      {loading
        ? <div className="skeleton skel-val" />
        : <div className="stat-card-val">{value}</div>
      }
      {sub && <div className="stat-card-sub">{sub}</div>}
    </div>
  );
}

function CountryRow({ item, onClick, rank }) {
  const rc = riskColor(item.riskScore);
  return (
    <tr onClick={onClick} tabIndex={0} onKeyDown={e => e.key === "Enter" && onClick()}>
      <td>
        <span style={{ fontFamily:"var(--font-mono)", color:"var(--gray-400)", fontSize:".8rem" }}>
          {String(rank).padStart(2,"0")}
        </span>
      </td>
      <td>
        <div style={{ display:"flex", alignItems:"center", gap:".6rem" }}>
          {item.flag && <img src={item.flag} alt="" style={{ width:22, height:15, objectFit:"cover", borderRadius:3, flexShrink:0 }} />}
          <span style={{ fontWeight:600 }}>{item.country}</span>
        </div>
      </td>
      <td className="hide-mobile mono">{fmt.compact(item.cases)}</td>
      <td className="hide-mobile mono" style={{ color:"var(--risk-critical)" }}>{fmt.compact(item.deaths)}</td>
      <td>
        <div style={{ display:"flex", alignItems:"center", gap:".6rem" }}>
          <div className="risk-bar" style={{ width:64, flexShrink:0 }}>
            <div className="risk-bar-fill" style={{ width:`${item.riskScore}%`, background: rc }} />
          </div>
          <span style={{ fontFamily:"var(--font-mono)", fontSize:".75rem", color: rc, fontWeight:700 }}>
            {item.riskScore}
          </span>
        </div>
      </td>
    </tr>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [activeDisease, setActiveDisease] = useState("covid19");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("cases");

  const { global, countries, loading, error, selected, selectCountry, clearSelected } =
    useDisease(activeDisease);

  const filtered = countries
    .filter(c => c.country.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (b[sortBy] ?? 0) - (a[sortBy] ?? 0));

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="dashboard page-enter">
      <style>{`
        .dashboard { display: flex; flex-direction: column; gap: 1.5rem; }
        .dash-header { display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
        .dash-greeting { font-size: .85rem; color: var(--gray-400); margin-bottom: .25rem; }
        .dash-title { font-size: 1.5rem; font-weight: 800; color: var(--gray-900); letter-spacing: -.02em; }
        .disease-tabs { display: flex; gap: .5rem; flex-wrap: wrap; }
        .disease-tab {
          display: flex; align-items: center; gap: .4rem;
          padding: .5rem 1rem;
          border-radius: 99px;
          font-size: .85rem; font-weight: 600;
          cursor: pointer; border: 1.5px solid var(--border);
          background: var(--white); color: var(--gray-600);
          transition: all .18s ease; font-family: var(--font-body);
        }
        .disease-tab:hover { border-color: var(--orbit-green); color: var(--orbit-green-dim); }
        .disease-tab.active {
          background: var(--orbit-green); color: white;
          border-color: var(--orbit-green);
          box-shadow: var(--shadow-green);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
        }
        .dash-body { display: grid; grid-template-columns: 1fr 340px; gap: 1.25rem; }
        @media (max-width: 900px) { .dash-body { grid-template-columns: 1fr; } }
        .table-card { overflow: hidden; }
        .table-toolbar {
          display: flex; align-items: center; gap: .75rem;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border);
          flex-wrap: wrap;
        }
        .table-title { font-weight: 700; color: var(--gray-900); flex: 1; }
        .search-input {
          padding: .45rem .875rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          font-family: var(--font-body);
          font-size: .875rem;
          color: var(--gray-700);
          background: var(--gray-50);
          outline: none;
          width: 180px;
          transition: border-color .15s;
        }
        .search-input:focus { border-color: var(--orbit-green); background: white; }
        .sort-select {
          padding: .45rem .75rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          font-family: var(--font-body);
          font-size: .875rem;
          color: var(--gray-700);
          background: var(--gray-50);
          outline: none;
          cursor: pointer;
        }
        .table-body { overflow-y: auto; max-height: 520px; }
        .error-msg {
          background: #fee2e2; color: var(--risk-critical);
          border: 1px solid #fca5a5; border-radius: var(--radius-sm);
          padding: 1rem 1.25rem; font-size: .875rem;
        }

        /* Country detail panel */
        .detail-panel { display: flex; flex-direction: column; gap: 1rem; }
        .detail-card { padding: 1.25rem; }
        .detail-country-header {
          display: flex; align-items: center; gap: .75rem; margin-bottom: 1.25rem;
        }
        .detail-flag { width: 40px; height: 26px; object-fit: cover; border-radius: 4px; }
        .detail-country-name { font-size: 1.1rem; font-weight: 800; color: var(--gray-900); }
        .detail-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: .5rem 0;
          border-bottom: 1px solid var(--border);
          font-size: .875rem;
        }
        .detail-row:last-child { border-bottom: none; }
        .detail-row-label { color: var(--gray-500); }
        .detail-row-val { font-weight: 700; color: var(--gray-900); font-family: var(--font-mono); }
        .empty-state {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: .75rem; padding: 3rem 1.5rem; color: var(--gray-400); text-align: center;
        }
        .empty-icon { font-size: 2.5rem; opacity: .5; }
        .map-cta {
          background: linear-gradient(135deg, var(--orbit-green-bg), white);
          border: 1px solid var(--border-em);
          border-radius: var(--radius);
          padding: 1.25rem;
          display: flex; flex-direction: column; gap: .75rem;
        }
        .map-cta h4 { font-size: .95rem; font-weight: 700; color: var(--gray-900); }
        .map-cta p { font-size: .82rem; color: var(--gray-500); }
      `}</style>

      {/* Header */}
      <div className="dash-header">
        <div>
          <div className="dash-greeting">{greeting}, {user?.name?.split(" ")[0] || "Researcher"} 👋</div>
          <div className="dash-title">Global Outbreak Intelligence</div>
        </div>
        <div className="disease-tabs">
          {DISEASES.map(d => (
            <button
              key={d.key}
              className={`disease-tab ${activeDisease === d.key ? "active" : ""}`}
              onClick={() => setActiveDisease(d.key)}
            >
              {d.icon} {d.label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="error-msg">⚠ Could not load data: {error}</div>}

      {/* Global stats */}
      <div className="stats-grid">
        <StatCard label="Total Cases"     value={fmt.compact(global?.cases)}     sub={`+${fmt.compact(global?.todayCases)} today`}  accent="#3b82f6" loading={loading} />
        <StatCard label="Total Deaths"    value={fmt.compact(global?.deaths)}    sub={`+${fmt.compact(global?.todayDeaths)} today`}  accent="#dc2626" loading={loading} />
        <StatCard label="Recovered"       value={fmt.compact(global?.recovered)} sub="cumulative"                                    accent="#10b981" loading={loading} />
        <StatCard label="Active Cases"    value={fmt.compact(global?.active)}    sub="currently infected"                            accent="#f59e0b" loading={loading} />
        <StatCard label="Critical"        value={fmt.compact(global?.critical)}  sub="in serious condition"                          accent="#ef4444" loading={loading} />
      </div>

      {/* Body: table + detail */}
      <div className="dash-body">

        {/* Countries table */}
        <div className="card table-card" style={{ padding:0 }}>
          <div className="table-toolbar">
            <div className="table-title">Countries — {filtered.length} tracked</div>
            <input
              className="search-input"
              placeholder="🔍 Search country..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="sort-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="cases">Sort: Cases</option>
              <option value="deaths">Sort: Deaths</option>
              <option value="active">Sort: Active</option>
              <option value="riskScore">Sort: Risk</option>
            </select>
          </div>

          <div className="table-body">
            {loading ? (
              <div style={{ padding:"1.5rem", display:"flex", flexDirection:"column", gap:".75rem" }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="skeleton" style={{ height:"2.5rem", borderRadius:6 }} />
                ))}
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Country</th>
                    <th className="hide-mobile">Cases</th>
                    <th className="hide-mobile">Deaths</th>
                    <th>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 100).map((c, i) => (
                    <CountryRow
                      key={c.countryCode + i}
                      item={c}
                      rank={i + 1}
                      onClick={() => selectCountry(c.country)}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="detail-panel">
          {/* Map CTA */}
          <div className="map-cta">
            <div style={{ fontSize:"1.5rem" }}>🗺</div>
            <h4>View Interactive Map</h4>
            <p>See outbreak heatmap with risk coloring across all countries</p>
            <button className="btn btn-primary" style={{ width:"100%" }} onClick={() => navigate("/map")}>
              Open Live Map →
            </button>
          </div>

          {/* Country detail */}
          <div className="card detail-card" style={{ padding:"1.25rem" }}>
            {selected ? (
              <>
                <div className="detail-country-header">
                  {selected.flag && <img src={selected.flag} alt="" className="detail-flag" />}
                  <div>
                    <div className="detail-country-name">{selected.country}</div>
                    <span className={`badge badge-${selected.risk?.label?.toLowerCase()}`}>
                      {selected.risk?.label} · Risk {selected.riskScore}
                    </span>
                  </div>
                  <button onClick={clearSelected} style={{ marginLeft:"auto", background:"none", border:"none", cursor:"pointer", color:"var(--gray-400)", fontSize:"1.1rem" }}>✕</button>
                </div>
                {[
                  { label:"Total Cases",     val: fmt.number(selected.cases) },
                  { label:"Deaths",          val: fmt.number(selected.deaths) },
                  { label:"Recovered",       val: fmt.number(selected.recovered) },
                  { label:"Active",          val: fmt.number(selected.active) },
                  { label:"Critical",        val: fmt.number(selected.critical) },
                  { label:"Cases / 1M pop",  val: fmt.number(selected.casesPerMillion) },
                  { label:"Deaths / 1M pop", val: fmt.number(selected.deathsPerMillion) },
                  { label:"Today Cases",     val: `+${fmt.number(selected.todayCases)}` },
                  { label:"Today Deaths",    val: `+${fmt.number(selected.todayDeaths)}` },
                  { label:"Updated",         val: fmt.relativeTime(selected.updated) },
                ].map(({ label, val }) => (
                  <div className="detail-row" key={label}>
                    <span className="detail-row-label">{label}</span>
                    <span className="detail-row-val">{val}</span>
                  </div>
                ))}
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🌍</div>
                <p style={{ fontSize:".875rem" }}>
                  Select a country from the table<br />to see detailed statistics
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
