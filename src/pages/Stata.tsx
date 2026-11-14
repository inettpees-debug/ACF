import { useState } from "react";
import { Link } from "react-router-dom";
import { stataAssignmentSnippet, stataModule } from "../data/site";
import { Breadcrumbs } from "../components/TaskNav";
import { usePageTitle, useReveal } from "../hooks";

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="copy-btn"
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setDone(true);
          window.setTimeout(() => setDone(false), 1600);
        });
      }}
    >
      {done ? "COPIED" : "COPY STATA CODE"}
    </button>
  );
}

export default function Stata() {
  usePageTitle("04 · Stata Do-Files & Logs");
  const reveal = useReveal<HTMLDivElement>();

  return (
    <div ref={reveal} className="task-page status-pending">
      <header className="task-header page-pad">
        <Breadcrumbs current="Module 04" />
        <div className="task-header-grid">
          <div className="task-header-main">
            <p className={"task-kicker mono enter is-in" /* taste-skill-ignore: rulebook kicker spec */}>
              Module 04 · Reproducibility appendix
            </p>
            <h1 className="task-title enter">Stata do-files &amp; logs</h1>
            <p className="task-question enter">{stataModule.question}</p>
          </div>
          <div className="task-header-side enter">
            <p className="status-line">
              <span className="is-waiting">◌ {stataModule.statusLabel}</span>
            </p>
            <p className="meta">
              The professor encourages maximum clarity about how reported
              results are generated. Everything the group produces for Tasks 01
              and 02 lands here.
            </p>
          </div>
        </div>
      </header>

      <div className="task-body page-pad">
        <section className="task-section">
          <h2 className="enter">Variable construction, as assigned</h2>
          <p className="task-paragraph enter">
            Quoted from the professor&apos;s Task 2 instructions, so the
            transformations are inspectable before the group&apos;s own code
            arrives:
          </p>
          <div className="code-block enter">
            <div className="code-block-head">
              <p className="code-block-title">assignment_variables.do</p>
              <CopyButton text={stataAssignmentSnippet} />
            </div>
            <pre>
              <code>{stataAssignmentSnippet}</code>
            </pre>
          </div>
        </section>

        <section className="task-section">
          <h2 className="enter">The group&apos;s do-files</h2>
          <div className="stage-grid">
            <div className="stage-main">
              <div className="stage-slot" aria-label="Reserved space for the Task 01 do-file">
                <p className="mono">TASK01_EVENTSTUDY.DO — PENDING</p>
                <p>
                  The event-study do-file: announcement-date matching, window
                  construction, market-model estimation, and the sensitivity
                  checks. Appears here the moment the group&apos;s final code
                  is supplied.
                </p>
              </div>
            </div>
            <div className="stage-main">
              <div className="stage-slot" aria-label="Reserved space for the Task 02 do-file">
                <p className="mono">TASK02_EXECOMP.DO — PENDING</p>
                <p>
                  The compensation do-file: variable generation, summary
                  statistics, the regression sequence including winsorizing,
                  pay sensitivity, gender interactions, and the
                  omitted-variable transformation.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="task-section">
          <h2 className="enter">Estimation logs</h2>
          <p className="task-paragraph enter">
            Collapsible, line-numbered logs for exact reproduction of every
            table and figure in modules{" "}
            <Link to="/task-1">{/* taste-skill-ignore: rulebook module numbering */}01</Link>{" "}
            and{" "}
            <Link to="/task-2">{/* taste-skill-ignore: rulebook module numbering */}02</Link>.
          </p>
          <div className="enter">
            <details className="log-slot">
              <summary>task01_eventstudy.log — pending</summary>
              <div className="log-body">
                <p>
                  The full Stata log for the event study will be embedded here
                  once the final run is complete.
                </p>
              </div>
            </details>
          </div>
          <div className="enter" style={{ marginTop: "0.75rem" }}>
            <details className="log-slot">
              <summary>task02_execomp.log — pending</summary>
              <div className="log-body">
                <p>
                  The full Stata log for the compensation analysis will be
                  embedded here once the final run is complete.
                </p>
              </div>
            </details>
          </div>
        </section>
      </div>

      <div className="task-foot page-pad">
        <div className="enter">
          <div className="pager-link">
            <span className="pager-dir">Next</span>
            <span className="pager-title">
              <Link to="/">Back to the overview</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
