import TaskPageLayout, { Kpi } from "../components/TaskPageLayout";
import { tasks } from "../data/site";
import { usePageTitle } from "../hooks";

export default function Task1() {
  const task = tasks[0];
  usePageTitle("01 · M&A Event Study");

  return (
    <TaskPageLayout
      task={task}
      kpis={
        <>
          <Kpi label="MARKET MODEL α / β" sub="MEAN ADJ. R²" pending />
          <Kpi label="AAR [0]" sub="ANNOUNCEMENT DAY" pending />
          <Kpi label="CAAR [−1, +1]" sub="3-DAY WINDOW" pending />
          <Kpi label="CAAR [−2, +2]" sub="5-DAY WINDOW" pending />
        </>
      }
      pager={{ next: { to: "/task-2", label: "02 · CEO Compensation" } }}
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
        <h2 className="enter">Main stage</h2>
        <div className="stage-grid enter">
          <div className="stage-main">
            <h3>CAAR trajectory · t−2 to t+2</h3>
            <div className="stage-slot" aria-label="Reserved space for the CAAR trajectory chart">
              <p className="mono">AWAITING FINAL ESTIMATES</p>
              <p>
                The cumulative average abnormal return curve around the
                announcement, drawn as a 2px signal-amber line with hollow data
                nodes, once the group&apos;s final estimates are supplied. No
                curve is shown now because none has been supplied.
              </p>
            </div>
          </div>
          <div className="stage-side">
            <h3>Sensitivity &amp; window rationale</h3>
            <p>
              Recommended windows from the assignment: event window t−2 to t+2,
              estimation window t−250 to t−50, with the S&amp;P 500 as the
              market model. Once results are in, this card explains the
              econometric rationale for the window and outlier choices the
              group made, and how sensitive the conclusions are to them.
            </p>
          </div>
        </div>
      </section>

      <section className="task-section">
        <h2 className="enter">50-deal acquirer breakdown</h2>
        <div className="pending-panel enter" role="note">
          <p className="pending-title">Table pending</p>
          <p>
            A searchable, sortable table of all 50 acquirers (deal value &gt;
            $100m, 2010–2015) with each deal&apos;s α, β, adjusted R², and
            CAR[−2, +2] will appear here, transcribed from the group&apos;s
            final output. <strong>No figures are shown before they exist.</strong>
          </p>
        </div>
      </section>
    </TaskPageLayout>
  );
}
