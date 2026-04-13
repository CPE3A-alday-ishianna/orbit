import { useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { useDisease } from "../hooks/useDisease";
import { fmt, riskColor } from "../utils/format";
import "leaflet/dist/leaflet.css";

const DISEASES = [
  { key: "covid19",      label: "COVID-19",     icon: "🦠" },
  { key: "mpox",         label: "Mpox",         icon: "🧬" },
  { key: "influenza",    label: "Influenza",     icon: "🌡" },
  { key: "tuberculosis", label: "Tuberculosis",  icon: "🫁" },
  { key: "dengue",       label: "Dengue",        icon: "🦟" },
  { key: "cholera",      label: "Cholera",       icon: "💧" },
  { key: "measles",      label: "Measles",       icon: "⚕️" },
];

const RISK_LEGEND = [
  { label: "Critical", color: "#dc2626", range: "75–100" },
  { label: "High",     color: "#ea580c", range: "50–74"  },
  { label: "Moderate", color: "#eab308", range: "25–49"  },
  { label: "Low",      color: "#22c55e", range: "5–24"   },
  { label: "Minimal",  color: "#94a3b8", range: "0–4"    },
];

function MapMarkers({ countries, onSelect }) {
  return countries
    .filter(c => c.lat && c.lng && c.cases > 0)
    .map((c, i) => {
      const radius = Math.max(4, Math.min(40, Math.sqrt(c.cases / 5000)));
      const color  = riskColor(c.riskScore);
      return (
        <CircleMarker
          key={`${c.countryCode}-${i}`}
          center={[c.lat, c.lng]}
          radius={radius}
          pathOptions={{ color, weight: 1.5, opacity: 0.9, fillColor: color, fillOpacity: 0.55 }}
          eventHandlers={{ click: () => onSelect(c) }}
        >
          <Popup>
            <div style={{ fontFamily:"var(--font-body)", minWidth:200 }}>
              <div style={{ display:"flex", alignItems:"center", gap:".6rem", marginBottom:".6rem" }}>
                {c.flag && <img src={c.flag} alt="" style={{ width:26, height:17, objectFit:"cover", borderRadius:3 }} />}
                <strong style={{ fontSize:".95rem", color:"#111827" }}>{c.country}</strong>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:".4rem", marginBottom:".6rem" }}>
                <span style={{ width:9,height:9,borderRadius:"50%",background:color,display:"inline-block" }}/>
                <span style={{ fontSize:".75rem", fontWeight:700, color }}>{c.risk?.label} Risk · {c.riskScore}/100</span>
              </div>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:".8rem" }}>
                <tbody>
                  {[["Cases", fmt.number(c.cases)],["Deaths", fmt.number(c.deaths)],
                    ["Active", fmt.number(c.active)],["Today +", fmt.number(c.todayCases)]
                  ].map(([l,v]) => (
                    <tr key={l}>
                      <td style={{ color:"#6b7280", padding:".18rem 0" }}>{l}</td>
                      <td style={{ textAlign:"right", fontWeight:700, fontFamily:"monospace" }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Popup>
        </CircleMarker>
      );
    });
}

export default function MapPage() {
  const [activeDisease, setActiveDisease] = useState("covid19");
  const [selected, setSelected]           = useState(null);
  const { countries, loading }            = useDisease(activeDisease);

  return (
    <div className="map-page page-enter">
      <style>{`
        .map-page { display:flex; flex-direction:column; gap:1rem; height:100%; }
        .map-header { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:1rem; }
        .map-title { font-size:1.4rem; font-weight:800; color:var(--gray-900); letter-spacing:-.02em; }
        .map-sub { font-size:.82rem; color:var(--gray-400); margin-top:.2rem; }
        .map-tabs { display:flex; gap:.4rem; flex-wrap:wrap; }
        .map-tab {
          padding:.4rem .8rem; border-radius:99px; font-size:.82rem; font-weight:600;
          cursor:pointer; border:1.5px solid var(--border); background:var(--white);
          color:var(--gray-600); transition:all .18s; font-family:var(--font-body);
        }
        .map-tab:hover { border-color:var(--orbit-green); color:var(--orbit-green-dim); }
        .map-tab.active { background:var(--orbit-green); color:white; border-color:var(--orbit-green); box-shadow:var(--shadow-green); }
        .map-body { display:flex; gap:1rem; flex:1; min-height:0; }
        .map-wrapper {
          flex:1; position:relative; border-radius:var(--radius);
          overflow:hidden; border:1px solid var(--border); min-height:520px; background:#f0f4f8;
        }
        .leaflet-container { width:100%; height:100%; min-height:520px; border-radius:var(--radius); }
        .map-loading {
          position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
          background:rgba(255,255,255,.85); backdrop-filter:blur(4px); z-index:1000;
          flex-direction:column; gap:.875rem; border-radius:var(--radius);
        }
        .map-loading p { font-size:.9rem; color:var(--gray-500); font-family:var(--font-mono); }
        @keyframes spin { to { transform:rotate(360deg); } }
        .spinner { width:36px;height:36px;border:3px solid var(--orbit-green-pale);border-top-color:var(--orbit-green);border-radius:50%;animation:spin .8s linear infinite; }
        .map-legend {
          position:absolute; bottom:1.5rem; left:1rem;
          background:rgba(255,255,255,.96); backdrop-filter:blur(8px);
          border:1px solid var(--border); border-radius:var(--radius-sm);
          padding:.875rem 1rem; z-index:1000; box-shadow:var(--shadow);
        }
        .map-legend-title { font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--gray-500);font-family:var(--font-mono);margin-bottom:.5rem; }
        .legend-item { display:flex;align-items:center;gap:.5rem;font-size:.78rem;color:var(--gray-700);margin-bottom:.3rem;font-weight:500; }
        .legend-dot { width:12px;height:12px;border-radius:50%;flex-shrink:0; }
        .legend-range { color:var(--gray-400);font-size:.7rem;font-family:var(--font-mono);margin-left:auto;padding-left:.5rem; }
        .map-tip {
          position:absolute; bottom:1.5rem; right:1rem;
          background:rgba(255,255,255,.88); backdrop-filter:blur(6px);
          border:1px solid var(--border); border-radius:var(--radius-sm);
          padding:.5rem .875rem; z-index:999; font-size:.78rem;
          color:var(--gray-500); font-family:var(--font-mono);
        }
        /* Detail panel */
        .detail-panel { width:270px;flex-shrink:0;background:var(--white);border:1px solid var(--border);border-radius:var(--radius);overflow-y:auto;display:flex;flex-direction:column; }
        .detail-empty { flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem 1.5rem;text-align:center;gap:.75rem; }
        .detail-empty-icon { font-size:2.5rem;opacity:.4; }
        .detail-empty p { font-size:.85rem;color:var(--gray-400);line-height:1.6; }
        .detail-head { padding:1.25rem 1.25rem .75rem;border-bottom:1px solid var(--border); }
        .detail-name { font-size:1rem;font-weight:800;color:var(--gray-900);margin-bottom:.35rem; }
        .detail-body { padding:.75rem 1.25rem 1.25rem; }
        .drow { display:flex;justify-content:space-between;align-items:center;padding:.4rem 0;border-bottom:1px solid var(--border);font-size:.82rem; }
        .drow:last-child { border-bottom:none; }
        .dlabel { color:var(--gray-500); }
        .dval { font-weight:700;font-family:var(--font-mono);color:var(--gray-900); }
        @media (max-width:900px) { .detail-panel { display:none; } }
      `}</style>

      <div className="map-header">
        <div>
          <div className="map-title">🗺 Live Outbreak Map</div>
          <div className="map-sub">
            {loading ? "Loading..." : `${countries.filter(c=>c.cases>0).length} countries with data · Click a circle for details`}
          </div>
        </div>
        <div className="map-tabs">
          {DISEASES.map(d => (
            <button key={d.key} className={`map-tab ${activeDisease===d.key?"active":""}`}
              onClick={() => { setActiveDisease(d.key); setSelected(null); }}>
              {d.icon} {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="map-body">
        <div className="map-wrapper">
          <MapContainer center={[20,0]} zoom={2} minZoom={1.5} maxZoom={8}
            style={{ width:"100%", height:"100%", minHeight:520 }}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
              attribution='© <a href="https://carto.com/">CARTO</a>' subdomains="abcd" />
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
              subdomains="abcd" />
            {!loading && <MapMarkers countries={countries} onSelect={setSelected} />}
          </MapContainer>

          {loading && (
            <div className="map-loading">
              <div className="spinner" />
              <p>Fetching outbreak data...</p>
            </div>
          )}

          <div className="map-legend">
            <div className="map-legend-title">Risk Level</div>
            {RISK_LEGEND.map(({ label, color, range }) => (
              <div className="legend-item" key={label}>
                <div className="legend-dot" style={{ background:color }} />
                <span>{label}</span>
                <span className="legend-range">{range}</span>
              </div>
            ))}
            <div style={{ marginTop:".6rem", paddingTop:".5rem", borderTop:"1px solid var(--border)" }}>
              <div className="map-legend-title" style={{ marginBottom:".2rem" }}>Circle Size</div>
              <div style={{ fontSize:".72rem", color:"var(--gray-500)" }}>∝ total case count</div>
            </div>
          </div>

          {!loading && countries.length > 0 && !selected && (
            <div className="map-tip">💡 Click any circle for details</div>
          )}
        </div>

        {/* Detail panel */}
        <div className="detail-panel">
          {selected ? (
            <>
              <div className="detail-head">
                <div style={{ display:"flex", alignItems:"center", gap:".6rem", marginBottom:".5rem" }}>
                  {selected.flag && <img src={selected.flag} alt="" style={{ width:30,height:19,objectFit:"cover",borderRadius:3 }} />}
                  <div className="detail-name">{selected.country}</div>
                  <button onClick={() => setSelected(null)} style={{ marginLeft:"auto",background:"none",border:"none",cursor:"pointer",color:"var(--gray-400)",fontSize:"1rem" }}>✕</button>
                </div>
                <span className={`badge badge-${selected.risk?.label?.toLowerCase()}`}>
                  {selected.risk?.label} Risk
                </span>
                <div style={{ height:5,borderRadius:99,background:"var(--gray-100)",overflow:"hidden",marginTop:".5rem" }}>
                  <div style={{ height:"100%",borderRadius:99,width:`${selected.riskScore}%`,background:riskColor(selected.riskScore),transition:"width .5s ease" }} />
                </div>
                <div style={{ fontSize:".72rem",color:"var(--gray-400)",fontFamily:"var(--font-mono)",marginTop:".3rem" }}>
                  Score: {selected.riskScore}/100
                </div>
              </div>
              <div className="detail-body">
                {[
                  ["Total Cases",   fmt.number(selected.cases)],
                  ["Deaths",        fmt.number(selected.deaths)],
                  ["Recovered",     fmt.number(selected.recovered)],
                  ["Active",        fmt.number(selected.active)],
                  ["Critical",      fmt.number(selected.critical)],
                  ["Cases/1M",      fmt.number(selected.casesPerMillion)],
                  ["Deaths/1M",     fmt.number(selected.deathsPerMillion)],
                  ["Today Cases",   `+${fmt.number(selected.todayCases)}`],
                  ["Today Deaths",  `+${fmt.number(selected.todayDeaths)}`],
                  selected.year && ["Data Year", selected.year],
                  selected.incidencePer100k && ["Per 100k", Number(selected.incidencePer100k).toFixed(1)],
                ].filter(Boolean).map(([l,v]) => (
                  <div className="drow" key={l}>
                    <span className="dlabel">{l}</span>
                    <span className="dval">{v}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="detail-empty">
              <div className="detail-empty-icon">🌍</div>
              <p>Click any circle on the map to see detailed country statistics</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
