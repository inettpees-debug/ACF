import { useState } from "react";
import TaskPageLayout from "../components/TaskPageLayout";
import {
  csrPillars,
  essaySummary,
  miniCases,
  tasks,
} from "../data/site";
import { usePageTitle, useReveal } from "../hooks";
import Boardroom from "../game/Boardroom";

export default function Task3() {
  const task = tasks[2];
  usePageTitle("03 · CSR & Governance");
  const reveal = useReveal<HTMLDivElement>();
  const [playing, setPlaying] = useState(false);

  return (
    <div ref={reveal}>
      <TaskPageLayout
        task={task}
        pager={{
          prev: { to: "/task-2", label: "02 · CEO Compensation" },
          next: { to: "/stata", label: "04 · Stata Do-Files & Logs" },
        }}
      >
        {/* --- The essay in brief: Swiss editorial contrast zone ---------- */}
        <section className="task-section">
          <h2 className="enter">The essay in brief</h2>
          <figure className="essay-summary editorial enter">
            <figcaption className="essay-caption">
              From the introduction of the group&apos;s final essay (3,353
              words), verbatim. The complete argument, the two mini-cases, and
              all references are in the document, downloadable above and below.
            </figcaption>
            <blockquote>
              <p>{essaySummary}</p>
            </blockquote>
          </figure>
        </section>

        {/* --- 3-pillar framework matrix ---------------------------------- */}
        <section className="task-section">
          <h2 className="enter">The three-pillar framework</h2>
          <p className="task-paragraph enter">
            The essay&apos;s core distinction, mirrored from its introduction
            and synthesis: who bears the cost, who authorized it, and therefore
            who should decide.
          </p>
          <div className="pillar-grid">
            {csrPillars.map((p) => (
              <div key={p.id} className="pillar enter">
                <h3>{p.label}</h3>
                <p className="pillar-assoc">{p.association}</p>
                <p className="pillar-verdict">{p.verdict}</p>
                <p className="pillar-decider">{p.decider}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- Mini-case split view ---------------------------------------- */}
        <section className="task-section">
          <h2 className="enter">The two mini-cases</h2>
          <p className="task-paragraph enter">
            The assignment&apos;s own figures, with the essay&apos;s verdict on
            each. The Boardroom below lets you argue both cases yourself.
          </p>
          <div className="minicase-grid">
            {miniCases.map((m) => (
              <div key={m.id} className="minicase enter">
                <h3>{m.label}</h3>
                <p className="minicase-figures">{m.figures}</p>
                <p>
                  <strong>{m.question}</strong>
                </p>
                <p>{m.verdict}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- The Boardroom ------------------------------------------------ */}
        <section className="task-section" id="boardroom">
          <p className="boardroom-label enter">
            Interactive experience · optional · the essay never requires
            playing, and stays downloadable throughout
          </p>
          <h2 className="enter">The Boardroom</h2>
          <p className="task-paragraph enter">
            You are the acting CEO of a company facing the assignment&apos;s
            two decisions: a costly emissions commitment and a factory closure.
            BYTE, your advisor, has opinions about all of it. Three rounds per
            case, three governance perspectives, several endings. And, for the
            genuinely reckless, a firing. Every figure in the dialogue comes
            from the assignment; every argument traces back to the essay.
          </p>

          {playing ? (
            <div>
              <Boardroom
                onExit={() => {
                  setPlaying(false);
                  document
                    .getElementById("boardroom")
                    ?.scrollIntoView({ behavior: "auto", block: "start" });
                }}
              />
            </div>
          ) : (
            <p>
              <button
                type="button"
                className="action"
                onClick={() => setPlaying(true)}
              >
                Enter The Boardroom
              </button>
            </p>
          )}
        </section>
      </TaskPageLayout>
    </div>
  );
}
