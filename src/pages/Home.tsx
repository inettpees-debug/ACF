import { Link } from "react-router-dom";
import { facts, stataModule, tasks, teamMembers } from "../data/site";
import { usePageTitle, useReveal } from "../hooks";
import KineticWave from "../components/KineticWave";

export default function Home() {
  usePageTitle("Business decisions. Evidence. Responsibility.");
  const revealGuide = useReveal<HTMLDivElement>();
  const revealWork = useReveal<HTMLDivElement>();
  const revealTeam = useReveal<HTMLDivElement>();

  return (
    <div className="home">
      {/* --- Hero: terminal masthead with kinetic wave ------------------- */}
      <section className="hero" aria-label="Introduction">
        <div className="hero-wave" aria-hidden="true">
          <KineticWave />
        </div>
        <div
          className="hero-glow"
          aria-hidden="true"
        />
        <div className="hero-content page-pad">
          <p className={"hero-kicker mono enter is-in" /* taste-skill-ignore: rulebook hero kicker spec */}>
            Advanced Corporate Finance // Empirical Portfolio
          </p>
          <h1 className="hero-title">
            The Corporate
            <br />
            Decision Lab
          </h1>
          <p className="hero-statement">
            Business decisions. Evidence. Responsibility.
          </p>
          <p className="hero-support">
            An interactive exploration of the questions, evidence and decisions
            addressed in our three assignment tasks.
          </p>
          <div className="hero-actions">
            <a className="action" href="#work">
              Explore the work
            </a>
            <a className="action-quiet" href="#team">
              Meet the team
            </a>
          </div>
          <p className="hero-meta mono">
            MASTER IN ENTREPRENEURSHIP · GROUP PROJECT · 2026
          </p>
        </div>
      </section>

      {/* --- A guide to this submission (Swiss off-white contrast zone) --- */}
      <div ref={revealGuide}>
        <section className="guide-wrap page-pad" id="guide">
          <div className="guide editorial enter">
            <h2>A guide to this submission</h2>
            <p className="guide-lead">
              Professor Yurtoglu, dear colleagues: welcome. This site brings
              together our group&apos;s responses to the three tasks of the term
              assignment, each in its own module, with every written document
              ready to download.
            </p>
            <div className="guide-cols">
              <p>
                <strong>Task 01, the event study.</strong>{" "}
                Fifty completed M&amp;A deals by US firms, 2010 to 2015. Once our
                final results are in, the module presents the market-model
                evidence with interactive visualizations, so the abnormal
                returns can be explored rather than only read.
              </p>
              <p>
                <strong>Task 02, CEO compensation.</strong>{" "}
                Compensation data for roughly 10,000 CEOs across 2000 to 2010.
                The module will carry the regression evidence on firm size,
                profitability, and shareholder value, with interactive
                statistical results when the analysis is final.
              </p>
              <p>
                <strong>Task 03, CSR and governance.</strong>{" "}
                Our final essay on whether corporate social responsibility and
                shareholder-oriented governance can be reconciled, summarized
                with the full document to download, alongside The Boardroom, an
                optional interactive experience built on the assignment&apos;s
                two mini-cases.
              </p>
              <p>
                <strong>The documents.</strong>{" "}
                Every module offers its written submission for download, and
                module 04 collects the Stata code and logs for reproducibility.
                The interactive components complement the written work; nothing
                on this site replaces it.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* --- The four modules --------------------------------------------- */}
      <div ref={revealWork}>
        <section className="work page-pad" id="work">
          <div className="work-head">
            <h2 className="enter">Four modules</h2>
            <p className="work-note meta enter">
              One collaborative submission for Advanced Corporate Finance.
            </p>
          </div>

          <div className="module-grid">
            {tasks.map((t, i) => (
              <Link
                key={t.slug}
                to={t.slug}
                className={`module-card enter status-${t.status}`}
              >
                <p className="module-num mono">{String(i + 1).padStart(2, "0") /* taste-skill-ignore: rulebook module numbering */}</p>
                <h3>{t.shortTitle}</h3>
                <p className="module-q">{t.question}</p>
                <p className={`module-status mono status-${t.status}`}>
                  {t.status === "complete" ? "● COMPLETE" : "◌ IN PREPARATION"}
                </p>
                <span className="module-cta mono">
                  Open module <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
            <Link to="/stata" className="module-card enter status-pending">
              <p className="module-num mono">{/* taste-skill-ignore: rulebook module numbering */}04</p>
              <h3>{stataModule.shortTitle}</h3>
              <p className="module-q">{stataModule.question}</p>
              <p className="module-status mono status-pending">
                ◌ AWAITING DO-FILES
              </p>
              <span className="module-cta mono">
                Open module <span aria-hidden="true">→</span>
              </span>
            </Link>
          </div>
        </section>
      </div>

      {/* --- Team ----------------------------------------------------------- */}
      <div ref={revealTeam}>
        <section className="team page-pad" id="team">
          <div className="team-top">
            <div className="team-intro">
              <h2 className="enter">The people behind the project</h2>
              <p className="team-lead enter">
                Five contributors. One collaborative submission. Portraits and
                LinkedIn profiles will appear here as soon as the team has
                supplied them. Nothing on this page stands in for the real
                people.
              </p>
            </div>
            <div className="team-facts">
              {facts.map((f) => (
                <div key={f.label} className="fact">
                  <p className="fact-label mono">{f.label}</p>
                  <p className="fact-value mono">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          <ul className="team-row">
            {teamMembers.map((m) => (
              <li key={m.name} className="member enter">
                <div className="member-portrait" aria-hidden="true">
                  <span className="mono">PORTRAIT PENDING</span>
                </div>
                <h3 className="member-name">{m.name}</h3>
                <p className="meta mono">LINKEDIN — TO BE ADDED</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
