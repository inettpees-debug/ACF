import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const pillars = [
  { to: "/task-1", label: "01 // M&A EVENT STUDY" },
  { to: "/task-2", label: "02 // CEO COMP" },
  { to: "/task-3", label: "03 // CSR & GOV" },
  { to: "/stata", label: "04 // STATA" },
];

export default function SiteNav() {
  const { pathname, hash } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname, hash]);

  const isActive = (to: string) => pathname === to;

  return (
    <header className={`site-nav ${open ? "is-open" : ""}`}>
      <div className="site-nav-inner page-pad">
        <Link to="/" className="monogram" aria-label="The Corporate Decision Lab — home">
          <span className="monogram-main">
            ACF <span>// WHU MSc</span>
          </span>
          <span className="badge">TERM ASSIGNMENT</span>
        </Link>

        <nav id="site-nav-links" className={`nav-links ${open ? "is-open" : ""}`} aria-label="Main">
          {pillars.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              className={`nav-link ${isActive(p.to) ? "is-active" : ""}`}
              aria-current={isActive(p.to) ? "page" : undefined}
            >
              {p.label}
            </Link>
          ))}
          <Link className="nav-team nav-team-menu" to="/#team">
            TEAM
          </Link>
        </nav>

        <div className="nav-side">
          <span className="nav-due">DUE 21 DEC 2026</span>
          <Link className="nav-team" to="/#team">
            TEAM
          </Link>
        </div>

        <button
          type="button"
          className={`nav-toggle ${open ? "is-open" : ""}`}
          aria-expanded={open}
          aria-controls="site-nav-links"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
    </header>
  );
}
