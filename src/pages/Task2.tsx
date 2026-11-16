import TaskPageLayout, { Kpi } from "../components/TaskPageLayout";
import { tasks } from "../data/site";
import { usePageTitle } from "../hooks";

export default function Task2() {
  const task = tasks[1];
  usePageTitle("02 · CEO Compensation");

  return (
    <TaskPageLayout
      task={task}
      kpis={
        <>
          <Kpi label="SAMPLE" value="≈10,000" sub="CEOS · FIRMS OBSERVED MULTIPLE TIMES" />
          <Kpi label="PERIOD" value="2000–10" sub="FISCAL YEARS · EXECUCOMP" />
          <Kpi label="BASELINE OLS β / γ" sub="PROFITABILITY · SIZE" pending />
          <Kpi label="PAY SENSITIVITY" sub="PER $1,000 MKVALT" pending />
        </>
      }
      pager={{
        prev: { to: "/task-1", label: "01 · M&A Event Study" },
        next: { to: "/task-3", label: "03 · CSR & Governance" },
      }}
    >
      <section className="task-section" id="assignment">
        <h2 className="enter">The assignment</h2>
        {task.brief.map((p, i) => (
          <p key={i} className="task-paragraph enter">
            {p}
          </p>
        ))}
      </section>

      <section className="task-section">
        <h2 className="enter">Summary statistics &amp; regression comparison</h2>
        <div className="stage-grid enter">
          <div className="stage-main">
            <h3>Regression comparison · specifications (1)–(5)</h3>
            <div
              className="stage-slot"
              aria-label="Reserved space for the regression comparison table"
            >
              <p className="mono">AWAITING FINAL ESTIMATES</p>
              <p>
                Baseline OLS, winsorized (1st/99th percentile), pay-performance
                sensitivity, the gender interaction model, and the
                omitted-variable transformation — coefficients with standard
                errors beneath, booktabs rules, N and adjusted R² in the summary
                block. All values will be transcribed from the group&apos;s
                final output only.
              </p>
            </div>
          </div>
          <div className="stage-side">
            <h3>Economic impact plots</h3>
            <p>
              Once results are in: a halftone dot-matrix bar chart comparing a
              one-standard-deviation shock in Size versus Profitability, and the
              male-versus-female pay-sensitivity slopes. Dot-matrix fills, amber
              for the estimate under focus, slate for baselines.
            </p>
          </div>
        </div>
      </section>

      <section className="task-section">
        <h2 className="enter">Summary statistics matrix</h2>
        <div className="pending-panel enter" role="note">
          <p className="pending-title">Table pending</p>
          <p>
            Mean, median, standard deviation, minimum, and maximum for all raw
            and transformed variables (tdc1, at, ni, sale, mkvalt,
            Profitability, Size, and the log variables), with $000s versus
            $-millions unit badges.{" "}
            <strong>
              No values are shown before the group&apos;s final output exists.
            </strong>
          </p>
        </div>
      </section>
    </TaskPageLayout>
  );
}
