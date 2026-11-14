import { Link } from "react-router-dom";

export function Breadcrumbs({ current }: { current: string }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li aria-current="page">{current}</li>
      </ol>
    </nav>
  );
}

export function TaskPager({
  prev,
  next,
}: {
  prev?: { to: string; label: string };
  next?: { to: string; label: string };
}) {
  return (
    <nav className="task-pager enter" aria-label="Task navigation">
      {prev ? (
        <Link to={prev.to} className="pager-link pager-prev">
          <span className="pager-dir">Previous</span>
          <span className="pager-title">{prev.label}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link to={next.to} className="pager-link pager-next">
          <span className="pager-dir">Next</span>
          <span className="pager-title">{next.label}</span>
        </Link>
      ) : (
        <Link to="/" className="pager-link pager-next">
          <span className="pager-dir">Next</span>
          <span className="pager-title">Back to the overview</span>
        </Link>
      )}
    </nav>
  );
}
