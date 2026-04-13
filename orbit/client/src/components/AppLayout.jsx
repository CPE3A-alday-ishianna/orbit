import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { to: "/dashboard",  icon: "⬡", label: "Dashboard" },
  { to: "/map",        icon: "◈", label: "Live Map" },
  { to: "/statistics", icon: "▦", label: "Statistics" },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="app-layout">
      <style>{`
        .app-layout {
          display: flex;
          height: 100vh;
          overflow: hidden;
          background: var(--off-white);
        }

        /* ── Sidebar ── */
        .sidebar {
          width: var(--sidebar-w);
          min-width: var(--sidebar-w);
          background: var(--white);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          transition: width .25s ease, min-width .25s ease;
          z-index: 100;
          overflow: hidden;
        }
        .sidebar.collapsed { width: 68px; min-width: 68px; }

        .sidebar-brand {
          padding: 1.25rem 1.25rem 1rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: .75rem;
          overflow: hidden;
        }
        .orbit-logo {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, var(--orbit-green), var(--orbit-green-dim));
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem;
          flex-shrink: 0;
          box-shadow: var(--shadow-green);
        }
        .orbit-wordmark {
          overflow: hidden;
          white-space: nowrap;
        }
        .orbit-wordmark strong {
          display: block;
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 800;
          color: var(--gray-900);
          letter-spacing: .05em;
        }
        .orbit-wordmark span {
          font-size: .65rem;
          color: var(--gray-400);
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: .08em;
        }

        .sidebar-nav {
          flex: 1;
          padding: 1rem .75rem;
          display: flex;
          flex-direction: column;
          gap: .25rem;
          overflow-y: auto;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: .875rem;
          padding: .7rem .875rem;
          border-radius: var(--radius-sm);
          color: var(--gray-600);
          text-decoration: none;
          font-size: .9rem;
          font-weight: 500;
          transition: all .18s ease;
          white-space: nowrap;
          overflow: hidden;
        }
        .nav-link:hover {
          background: var(--orbit-green-bg);
          color: var(--orbit-green-dim);
        }
        .nav-link.active {
          background: var(--orbit-green-bg);
          color: var(--orbit-green-dim);
          font-weight: 600;
        }
        .nav-link.active .nav-icon {
          background: var(--orbit-green);
          color: white;
        }
        .nav-icon {
          width: 32px; height: 32px;
          border-radius: 7px;
          background: var(--gray-100);
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
          transition: all .18s ease;
        }

        .sidebar-footer {
          padding: .875rem .75rem;
          border-top: 1px solid var(--border);
        }
        .user-chip {
          display: flex;
          align-items: center;
          gap: .75rem;
          padding: .5rem .5rem;
          border-radius: var(--radius-sm);
          overflow: hidden;
        }
        .user-avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: var(--orbit-green-bg);
          border: 2px solid var(--orbit-green-pale);
          flex-shrink: 0;
          object-fit: cover;
        }
        .user-info { overflow: hidden; }
        .user-name {
          font-size: .85rem;
          font-weight: 600;
          color: var(--gray-800);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .user-email {
          font-size: .72rem;
          color: var(--gray-400);
          font-family: var(--font-mono);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .logout-btn {
          width: 100%;
          margin-top: .5rem;
          padding: .5rem;
          background: none;
          border: none;
          border-radius: var(--radius-sm);
          color: var(--gray-400);
          font-size: .8rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: .4rem;
          font-family: var(--font-body);
          transition: all .15s;
          white-space: nowrap;
          overflow: hidden;
        }
        .logout-btn:hover { color: var(--risk-critical); background: #fee2e2; }

        /* ── Toggle button ── */
        .sidebar-toggle {
          position: absolute;
          left: calc(var(--sidebar-w) - 14px);
          top: 50%;
          transform: translateY(-50%);
          width: 28px; height: 28px;
          border-radius: 50%;
          background: white;
          border: 1px solid var(--border);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: .7rem;
          color: var(--gray-500);
          transition: left .25s ease, transform .25s ease;
          z-index: 200;
          box-shadow: var(--shadow-sm);
        }
        .sidebar-toggle:hover { border-color: var(--orbit-green); color: var(--orbit-green); }

        /* ── Main ── */
        .main-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .main-header {
          height: var(--header-h);
          background: var(--white);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          padding: 0 1.5rem;
          gap: 1rem;
          flex-shrink: 0;
        }
        .live-indicator {
          display: flex;
          align-items: center;
          gap: .5rem;
          font-size: .8rem;
          color: var(--gray-500);
          font-family: var(--font-mono);
          margin-left: auto;
        }
        .main-content {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
        }

        @media (max-width: 768px) {
          .sidebar { display: none; }
        }
      `}</style>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
        <div className="sidebar-brand">
          <div className="orbit-logo">🛰</div>
          {sidebarOpen && (
            <div className="orbit-wordmark">
              <strong>O.R.B.I.T.</strong>
              <span>Disease Tracker</span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {NAV.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} className="nav-link">
              <span className="nav-icon">{icon}</span>
              {sidebarOpen && label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">
            {user?.photoURL
              ? <img src={user.photoURL} alt="avatar" className="user-avatar" />
              : <div className="user-avatar" style={{ display:"flex", alignItems:"center", justifyContent:"center", fontSize:".9rem" }}>👤</div>
            }
            {sidebarOpen && (
              <div className="user-info">
                <div className="user-name">{user?.name || "Researcher"}</div>
                <div className="user-email">{user?.email}</div>
              </div>
            )}
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span>⏻</span>
            {sidebarOpen && "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-area">
        <header className="main-header">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background:"none", border:"none", cursor:"pointer", fontSize:"1.1rem", color:"var(--gray-500)", padding:".25rem" }}
          >
            ☰
          </button>
          <div className="live-indicator">
            <span className="live-dot" />
            LIVE DATA
          </div>
        </header>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
