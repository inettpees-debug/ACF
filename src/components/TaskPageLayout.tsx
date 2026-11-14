import type { ReactNode } from "react";
import type { TaskMeta } from "../data/site";
import { documents } from "../data/site";
import { Breadcrumbs, TaskPager } from "./TaskNav";
import { DownloadPanel } from "./DownloadPanel";
import { useReveal } from "../hooks";

export function Kpi({
  label,
  value,
  sub,
  pending,
}: {
  label: string;
  value?: string;
  sub: string;
  pending?: boolean;
}) {
  return (
    <div className="kpi">
      <p className="kpi-label">{label}</p>
      <p className={`kpi-value ${pending ? "is-pending" : ""}`.trim()}>
        {value ?? "—"}
      </p>
      <p className={`kpi-sub ${pending ? "is-waiting" : ""}`.trim()}>{sub}</p>
    </div>
  );
}

/**
 * Shared structure for the module pages:
 * breadcrumb → heading + question + status → optional KPI strip →
 * children → download → pager.
 */
export default function TaskPageLayout({
  task,
  kpis,
  children,
  pager,
}: {
  task: TaskMeta;
  kpis?: ReactNode;
  children: ReactNode;
  pager: {
    prev?: { to: string; label: string };
    next?: { to: string; label: string };
  };
}) {
  const reveal = useReveal<HTMLDivElement>();
  const doc = documents[task.slug.replace("/", "")] ?? {
    id: task.slug,
    label: task.number,
    docx: null,
    pdf: null,
  };

  return (
    <div ref={reveal} className={`task-page status-${task.status}`}>
      <header className="task-header page-pad">
        <Breadcrumbs current={task.number} />
        <div className="task-header-grid">
          <div className="task-header-main">
            <p className={"task-kicker mono enter is-in" /* taste-skill-ignore: rulebook kicker spec */}>
              {task.number} · {task.points}
            </p>
            <h1 className="task-title enter">{task.shortTitle}</h1>
            <p className="task-exact-title enter">{task.title}</p>
            <p className="task-question enter">{task.question}</p>
          </div>
          <div className="task-header-side enter">
            <p className="status-line">
              {task.status === "complete" ? (
                <span className="is-live">● {task.statusLabel}</span>
              ) : (
                <span className="is-waiting">◌ {task.statusLabel}</span>
              )}
            </p>
            <DownloadPanel doc={doc} context="compact" />
            {task.status !== "complete" && (
              <a className="action-quiet" href="#assignment">
                Read the assignment
              </a>
            )}
          </div>
        </div>
        {kpis && <div className="kpi-strip">{kpis}</div>}
      </header>

      <div className="task-body page-pad">{children}</div>

      <div className="task-foot page-pad">
        <div className="enter">
          <DownloadPanel doc={doc} />
        </div>
        <TaskPager {...pager} />
      </div>
    </div>
  );
}
