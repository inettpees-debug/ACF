import { Link } from "react-router-dom";
import { documents } from "../data/site";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer page-pad">
      <div className="footer-top">
        <p className="footer-name">
          The Corporate <span>Decision Lab</span>
        </p>
        <p className="meta">
          Advanced Corporate Finance · Group submission · Winter semester
          2026/27
        </p>
      </div>

      <div className="footer-grid">
        <div className="footer-col">
          <h2>Site</h2>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/#team">The team</Link>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h2>Modules</h2>
          <ul>
            <li>
              <Link to="/task-1">01 // M&amp;A Event Study</Link>
            </li>
            <li>
              <Link to="/task-2">02 // CEO Compensation</Link>
            </li>
            <li>
              <Link to="/task-3">03 // CSR &amp; Governance</Link>
            </li>
            <li>
              <Link to="/stata">04 // Stata Do-Files &amp; Logs</Link>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h2>Documents</h2>
          <ul>
            <li>
              {documents["task-3"].docx ? (
                <a href={`/documents/${documents["task-3"].docx}`} download>
                  Task 03 essay (DOCX)
                </a>
              ) : (
                <span>Task 03 essay</span>
              )}
            </li>
            <li>Task 01 write-up (pending)</li>
            <li>Task 02 write-up (pending)</li>
          </ul>
        </div>
        <div className="footer-col">
          <h2>Course</h2>
          <ul>
            <li>Advanced Corporate Finance</li>
            <li>Prof. Dr. Burcin Yurtoglu</li>
            <li>Master in Entrepreneurship</li>
            <li>WHU – Otto Beisheim School of Management</li>
          </ul>
        </div>
      </div>

      <div className="footer-legal">
        <p>
          The Corporate Decision Lab · a group project submission ·{" "}
          {year === 2026 ? "2026" : year}
        </p>
        <a href="#main" className="to-top">
          ↑ Back to top
        </a>
      </div>
    </footer>
  );
}
