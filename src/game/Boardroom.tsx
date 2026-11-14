import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Art,
  FIRED_FX_MS,
  GAME_H,
  GAME_W,
  drawFrame,
  type ByteExpr,
} from "./spriteArt";
import {
  cases,
  introLines,
  perspectiveQuestion,
  perspectives,
  ruleOnFiring,
} from "./story";
import {
  emptyFlags,
  type CaseId,
  type Choice,
  type Ending,
  type GameFlags,
  type PerspectiveId,
  type SceneId,
} from "./types";
import "./game.css";

type Screen =
  | "title"
  | "name"
  | "intro"
  | "case-select"
  | "case-intro"
  | "perspective"
  | "reaction"
  | "round"
  | "consequence"
  | "ending"
  | "fired";

const FX_ICON = {
  pause: "/game/ui/icon_pause_1x.png",
  restart: "/game/ui/icon_restart_1x.png",
  exit: "/game/ui/icon_exit_1x.png",
  download: "/game/ui/icon_download_1x.png",
  continue: "/game/ui/icon_continue_1x.png",
} as const;

export default function Boardroom({ onExit }: { onExit: () => void }) {
  const [screen, setScreen] = useState<Screen>("title");
  const [name, setName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [perspective, setPerspective] = useState<PerspectiveId | null>(null);
  const [activeCase, setActiveCase] = useState<CaseId | null>(null);
  const [playedCases, setPlayedCases] = useState<CaseId[]>([]);
  const [flags, setFlags] = useState<GameFlags>(emptyFlags);
  const [roundIndex, setRoundIndex] = useState(0);
  const [ending, setEnding] = useState<Ending | null>(null);
  const [firedGrounds, setFiredGrounds] = useState("");
  const [paused, setPaused] = useState(false);
  const [menu, setMenu] = useState<null | "pause" | "restart" | "exit">(null);

  // Dialogue queue: lines for the current beat (dialogue renders instantly).
  const [lines, setLines] = useState<string[]>([]);
  const [lineIndex, setLineIndex] = useState(0);
  const [afterLines, setAfterLines] = useState<() => void>(() => {});

  const [art, setArt] = useState<Art | null>(null);
  const [artError, setArtError] = useState(false);
  const [firedBanner, setFiredBanner] = useState(false);

  const firedAt = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);
  const firstChoiceRef = useRef<HTMLButtonElement>(null);
  const nextBlink = useRef(0);

  const reducedMotion = useMemo(
    () =>
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const ctx = useMemo(
    () => ({
      name: name || "Boss",
      perspective: (perspective ?? "friedman") as PerspectiveId,
      flags,
    }),
    [name, perspective, flags],
  );

  const currentRound =
    activeCase && screen !== "ending" && screen !== "fired"
      ? cases[activeCase].rounds[roundIndex]
      : null;

  const currentLine = lines[lineIndex] ?? "";
  const dialogueVisible =
    currentLine !== "" &&
    (screen === "intro" ||
      screen === "perspective" ||
      screen === "reaction" ||
      screen === "round" ||
      screen === "consequence" ||
      screen === "ending");
  const choosing = screen === "round" && lineIndex >= lines.length;

  /* --- Load the art pack once ------------------------------------------------ */

  useEffect(() => {
    let cancelled = false;
    Art.load()
      .then((a) => !cancelled && setArt(a))
      .catch(() => !cancelled && setArtError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  /* --- Scene selection -------------------------------------------------------- */

  const scene: SceneId = useMemo(() => {
    switch (screen) {
      case "case-intro":
        return activeCase === "emissions"
          ? "emissions-factory"
          : activeCase === "closure"
            ? "closure-factory"
            : "boardroom";
      case "ending":
        return ending?.scene ?? "boardroom";
      case "fired":
        return "game-over";
      case "round":
      case "consequence":
        return currentRound?.scene ?? "boardroom";
      default:
        return screen === "title" || screen === "name" || screen === "intro"
          ? "office"
          : "boardroom";
    }
  }, [screen, activeCase, ending, currentRound]);

  /* --- Canvas: 192×108, nearest-neighbour, integer display scales ------------- */

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    canvas.width = GAME_W;
    canvas.height = GAME_H;
    // The stage shrink-wraps the canvas, so measure the flexible wrapper.
    // The wrapper is 100vw wide; clamp to the visible width so the canvas
    // never sits under a classic (non-overlay) scrollbar.
    const wrap = stage.parentElement;
    const fit = () => {
      const w = Math.min(
        (wrap ?? stage).clientWidth,
        document.documentElement.clientWidth,
      );
      const scale = Math.max(1, Math.floor(w / GAME_W));
      canvas.style.width = GAME_W * scale <= w ? `${GAME_W * scale}px` : "100%";
    };
    fit();
    const ro = new ResizeObserver(fit);
    if (wrap) ro.observe(wrap);
    else ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  /* --- Render loop: background, BYTE, talk/blink cycles, briefcase FX --------- */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !art) return;
    const c = canvas.getContext("2d");
    if (!c) return;

    let raf = 0;
    let talking = false;
    let blinkUntil = 0;

    const baseExpr = (): ByteExpr => {
      if (screen === "fired") return "shocked";
      if (screen === "ending") return (ending?.byteExpr ?? "happy") as ByteExpr;
      if (currentRound) return (currentRound.byteExpr ?? "neutral") as ByteExpr;
      return "neutral";
    };

    const loop = (t: number) => {
      if (!paused && !reducedMotion) {
        // talking: alternate mouth frames at ~150 ms while a line is shown
        talking =
          dialogueVisible && !reducedMotion && !paused && currentLine !== "";
        // blinking: 120 ms every 3–5 s, only on the neutral face at rest
        if (talking) {
          nextBlink.current = 0;
        } else if (t > nextBlink.current) {
          if (nextBlink.current === 0) {
            nextBlink.current = t + 3000 + Math.random() * 2000;
          } else {
            blinkUntil = t + 120;
            nextBlink.current = t + 3000 + Math.random() * 2000;
          }
        }
      }

      let expr = baseExpr();
      if (!paused && !reducedMotion) {
        if (t < blinkUntil && expr === "neutral" && !talking) expr = "blink";
        if (talking && expr === "neutral") {
          expr = Math.floor(t / 150) % 2 === 0 ? "neutral" : "talk2";
        }
      }

      const briefcaseElapsed =
        screen === "fired" ? t - firedAt.current : null;

      drawFrame(canvas, art, {
        scene,
        byte: expr,
        briefcaseElapsed,
        reducedMotion: reducedMotion || paused,
      });
      if (!paused || screen === "fired") raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [art, scene, paused, screen, dialogueVisible, currentLine, currentRound, ending, reducedMotion]);

  /* --- Fired banner appears once the briefcase has landed ---------------------- */

  useEffect(() => {
    if (screen !== "fired") {
      setFiredBanner(false);
      return;
    }
    if (reducedMotion) {
      setFiredBanner(true);
      return;
    }
    const delay = Math.max(0, FIRED_FX_MS + 400 - (performance.now() - firedAt.current));
    const t = window.setTimeout(() => setFiredBanner(true), delay);
    return () => window.clearTimeout(t);
  }, [screen, reducedMotion]);

  /* --- Focus management --------------------------------------------------------- */

  useEffect(() => {
    if (paused || menu) return;
    if (dialogueVisible) continueRef.current?.focus();
    else if (choosing) firstChoiceRef.current?.focus();
  }, [dialogueVisible, choosing, paused, menu, lineIndex, screen]);

  /* --- Dialogue helpers ----------------------------------------------------------- */

  const say = useCallback((newLines: string[], after: () => void) => {
    setLines(newLines);
    setLineIndex(0);
    setAfterLines(() => after);
  }, []);

  const advance = useCallback(() => {
    if (paused || menu) return;
    if (lineIndex < lines.length - 1) {
      setLineIndex((i) => i + 1);
    } else {
      setLines([]);
      setLineIndex(0);
      afterLines();
    }
  }, [paused, menu, lineIndex, lines.length, afterLines]);

  /* --- Flow ------------------------------------------------------------------------ */

  const startGame = () => setScreen("name");

  const submitName = (explicit?: string) => {
    const clean = (explicit ?? nameInput).trim().slice(0, 24);
    setName(clean);
    setScreen("intro");
    say(introLines(clean || "Boss"), () => setScreen("case-select"));
  };

  const pickCase = (id: CaseId) => {
    setActiveCase(id);
    setFlags(emptyFlags());
    setRoundIndex(0);
    setEnding(null);
    setScreen("case-intro");
  };

  const continueFromCaseIntro = () => {
    setScreen("perspective");
    say([perspectiveQuestion()], () => {
      /* perspective cards render below the stage */
    });
  };

  const pickPerspective = (id: PerspectiveId) => {
    setPerspective(id);
    setScreen("reaction");
    const p = perspectives.find((x) => x.id === id)!;
    say([p.reaction], () => {
      setRoundIndex(0);
      setScreen("round");
      const fresh = { name: name || "Boss", perspective: id, flags };
      const round = cases[activeCase!].rounds[0];
      say(round.byte(fresh), () => {
        /* choices render */
      });
    });
  };

  const choose = (choice: Choice) => {
    if (!activeCase) return;
    const nextFlags = { ...flags };
    choice.setFlags?.forEach((f) => {
      nextFlags[f] = true;
    });
    setFlags(nextFlags);

    const ruling = ruleOnFiring(activeCase, nextFlags);
    if (ruling.fired) {
      firedAt.current = performance.now();
      setFiredGrounds(ruling.grounds);
      setScreen("fired");
      setLines([]);
      return;
    }

    setScreen("consequence");
    const nextCtx = {
      name: name || "Boss",
      perspective: ctx.perspective,
      flags: nextFlags,
    };
    say(choice.consequence(nextCtx), () => {
      const nextRound = roundIndex + 1;
      if (nextRound < cases[activeCase].rounds.length) {
        setRoundIndex(nextRound);
        setScreen("round");
        const r = cases[activeCase].rounds[nextRound];
        say(r.byte(nextCtx), () => {
          /* choices render */
        });
      } else {
        const chosen =
          cases[activeCase].endings.find((e) =>
            e.condition({ ...nextCtx, flags: nextFlags }),
          ) ?? cases[activeCase].endings[cases[activeCase].endings.length - 1];
        setEnding(chosen);
        setScreen("ending");
        say(chosen.lines({ ...nextCtx, flags: nextFlags }), () => {
          /* ending panel renders */
        });
        setPlayedCases((prev) =>
          prev.includes(activeCase) ? prev : [...prev, activeCase],
        );
      }
    });
  };

  const restartCase = () => {
    setMenu(null);
    setPaused(false);
    if (activeCase) pickCase(activeCase);
  };

  /* Fired-screen actions arrive as events from the overlay. */
  useEffect(() => {
    const handler = (e: Event) => {
      const action = (e as CustomEvent).detail as string;
      setMenu(null);
      setPaused(false);
      if (action === "restart" && activeCase) {
        pickCase(activeCase);
      } else if (action === "boardroom") {
        setLines([]);
        setEnding(null);
        setScreen("case-select");
      } else if (action === "website") {
        onExit();
      }
    };
    window.addEventListener("boardroom:fired-action", handler);
    return () => window.removeEventListener("boardroom:fired-action", handler);
  }, [activeCase, onExit]);

  const otherCase: CaseId | null = activeCase
    ? activeCase === "emissions"
      ? "closure"
      : "emissions"
    : null;

  /* --- Render ------------------------------------------------------------------------ */

  const essayHref = "/documents/Task-03-CSR-Essay.docx";

  const stageControls = (
    <div className="game-controls" role="toolbar" aria-label="Game controls">
      <button
        type="button"
        onClick={() => {
          setPaused(true);
          setMenu("pause");
        }}
        disabled={screen === "title" || screen === "fired"}
      >
        <img src={FX_ICON.pause} alt="" width="22" height="22" />
        Pause
      </button>
      <button
        type="button"
        onClick={() => activeCase && setMenu("restart")}
        disabled={!activeCase || screen === "ending" || screen === "fired"}
      >
        <img src={FX_ICON.restart} alt="" width="22" height="22" />
        Restart
      </button>
      <button type="button" onClick={() => setMenu("exit")}>
        <img src={FX_ICON.exit} alt="" width="22" height="22" />
        Exit
      </button>
      <a href={essayHref} download>
        <img src={FX_ICON.download} alt="" width="22" height="22" />
        Essay
      </a>
    </div>
  );

  return (
    <div className="boardroom" data-ui>
      <div className="boardroom-chrome">
        <p className="game-id">
          The Boardroom{" "}
          <span>
            {activeCase
              ? `· ${cases[activeCase].label}`
              : "· press start to begin"}
          </span>
        </p>
        <p className="game-art-note">
          Art and animation from the team&apos;s approved pack · all figures in
          dialogue are the assignment&apos;s own
        </p>
      </div>

      {artError && (
        <p className="game-art-note game-art-error" role="alert">
          The game art could not be loaded. Check that /game/ is deployed with
          the site.
        </p>
      )}

      {(screen === "round" || screen === "consequence") && currentRound && (
        <p className="game-situation">{currentRound.situation}</p>
      )}

      <div className="game-stage-wrap">
        <div className="game-stage" ref={stageRef}>
          <canvas ref={canvasRef} aria-hidden="true" />

          <div className="stage-overlay">
            {stageControls}

            {screen === "title" && (
              <div className="game-overlay game-title-screen">
                <img
                  className="game-logo"
                  src="/game/endings/boardroom_logo.png"
                  alt="The Boardroom"
                />
                <p className="game-subtitle">A corporate governance adventure</p>
                <button
                  type="button"
                  className="game-cta"
                  onClick={startGame}
                  autoFocus
                >
                  Start
                </button>
              </div>
            )}

            {dialogueVisible && art && (
              <div className="game-dialog" onClick={advance}>
                <p className="game-speaker">BYTE</p>
                <p className="game-line">{currentLine}</p>
                <button
                  ref={continueRef}
                  type="button"
                  className="game-continue"
                  onClick={(e) => {
                    e.stopPropagation();
                    advance();
                  }}
                >
                  <span>Continue</span>
                  <img
                    src={FX_ICON.continue}
                    alt=""
                    width="14"
                    height="8"
                  />
                </button>
              </div>
            )}

            {screen === "fired" && firedBanner && (
              <div className="game-overlay game-fired" aria-live="assertive">
                <img
                  className="game-over-img"
                  src="/game/endings/ending_game-over.png"
                  alt="You're fired"
                />
                {groundsLine(firedGrounds)}
                <div className="game-menu-row game-fired-actions">
                  <FiredActions />
                </div>
              </div>
            )}

            {(paused || menu) && (
              <div
                className="game-overlay game-menu"
                role="dialog"
                aria-modal="true"
              >
                {menu === "pause" && (
                  <div>
                    <p className="game-menu-title">Paused</p>
                    <button
                      type="button"
                      className="game-cta"
                      onClick={() => {
                        setPaused(false);
                        setMenu(null);
                      }}
                    >
                      Resume
                    </button>
                    <div className="game-menu-row">
                      <button type="button" onClick={() => setMenu("restart")}>
                        Restart case
                      </button>
                      <button type="button" onClick={() => setMenu("exit")}>
                        Exit
                      </button>
                    </div>
                  </div>
                )}
                {menu === "restart" && (
                  <div>
                    <p className="game-menu-title">Restart this case?</p>
                    <p className="game-menu-note">
                      Your progress in this case will be discarded.
                    </p>
                    <div className="game-menu-row">
                      <button
                        type="button"
                        className="game-cta"
                        onClick={restartCase}
                      >
                        Yes, restart
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMenu(null);
                          setPaused(false);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                {menu === "exit" && (
                  <div>
                    <p className="game-menu-title">Leave The Boardroom?</p>
                    <p className="game-menu-note">
                      You will return to the Task 03 page. The essay stays
                      downloadable there at all times.
                    </p>
                    <div className="game-menu-row">
                      <button
                        type="button"
                        className="game-cta"
                        onClick={onExit}
                      >
                        Yes, exit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMenu(null);
                          setPaused(false);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                {paused && !menu && <div />}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="game-dialog-area">
        {/* Name input */}
        {screen === "name" && (
          <form
            className="game-name-form"
            onSubmit={(e) => {
              e.preventDefault();
              submitName();
            }}
          >
            <label htmlFor="player-name" className="game-speaker">
              BYTE — “Before we begin, what should I call you?”
            </label>
            <input
              id="player-name"
              type="text"
              value={nameInput}
              maxLength={24}
              autoComplete="off"
              placeholder="A name or nickname"
              onChange={(e) => setNameInput(e.target.value)}
            />
            <div className="game-menu-row">
              <button type="submit" className="game-cta">
                Continue
              </button>
              <button type="button" onClick={() => submitName("Boss")}>
                Rather not — call me “Boss”
              </button>
            </div>
            <p className="game-menu-note">
              The name is used in this session’s dialogue only. Nothing is
              stored or collected.
            </p>
          </form>
        )}

        {/* Case select */}
        {screen === "case-select" && (
          <div className="game-cards">
            {(Object.keys(cases) as CaseId[]).map((id, i) => (
              <button
                key={id}
                type="button"
                className="game-card"
                autoFocus={i === 0}
                onClick={() => pickCase(id)}
              >
                <img
                  className="game-card-thumb"
                  src={
                    id === "emissions"
                      ? "/game/ui/thumb_case_emissions_4x.png"
                      : "/game/ui/thumb_case_closure_4x.png"
                  }
                  alt=""
                  width="96"
                  height="64"
                />
                <span className="game-card-label">{cases[id].label}</span>
                <span className="game-card-note">
                  {id === "emissions"
                    ? "€120m cost · €80m benefits · −€40m NPV"
                    : "€150m gain · 1,200 jobs · €60m transition"}
                </span>
                <span className="game-card-cta">
                  {playedCases.includes(id) ? "Play again" : "Open case"}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Case intro */}
        {screen === "case-intro" && activeCase && (
          <div className="game-case-intro">
            <p>{cases[activeCase].intro}</p>
            <button
              type="button"
              className="game-cta"
              onClick={continueFromCaseIntro}
              autoFocus
            >
              Continue
            </button>
          </div>
        )}

        {/* Perspective select */}
        {screen === "perspective" && lines.length === 0 && (
          <div className="game-cards game-perspectives">
            {perspectives.map((p, i) => (
              <button
                key={p.id}
                type="button"
                className="game-card"
                autoFocus={i === 0}
                onClick={() => pickPerspective(p.id)}
              >
                <span className="game-card-label">{p.label}</span>
                <span className="game-card-note">{p.description}</span>
                <span className="game-card-cta">Play as · {p.association}</span>
              </button>
            ))}
          </div>
        )}

        {/* Choices */}
        {choosing && currentRound && (
          <div className="game-choices" role="group" aria-label="Your options">
            <p className="game-speaker">Your move, {ctx.name}</p>
            {currentRound.choices.map((c, i) => (
              <button
                key={c.id}
                ref={i === 0 ? firstChoiceRef : undefined}
                type="button"
                className="game-choice"
                onClick={() => choose(c)}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}

        {/* Ending */}
        {screen === "ending" && ending && lines.length === 0 && (
          <div className="game-ending">
            <img
              className="game-winner-img"
              src="/game/endings/ending_winner.png"
              alt="Congrats — you'd make a nice CEO"
            />
            <h3 className="game-ending-title">{ending.title}</h3>
            <div className="game-menu-row game-ending-actions">
              {otherCase && !playedCases.includes(otherCase) && (
                <button
                  type="button"
                  className="game-cta"
                  onClick={() => pickCase(otherCase)}
                >
                  Play the other case
                </button>
              )}
              <button type="button" onClick={restartCase}>
                Restart this case
              </button>
              <button type="button" onClick={onExit}>
                Return to the essay page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* --- Fired overlay pieces ------------------------------------------------------ */

function groundsLine(grounds: string) {
  if (!grounds) return null;
  return <p className="game-fired-grounds">Grounds: {grounds}</p>;
}

function FiredActions() {
  const fire = (action: "restart" | "boardroom" | "website") => {
    window.dispatchEvent(
      new CustomEvent("boardroom:fired-action", { detail: action }),
    );
  };
  return (
    <>
      <button type="button" className="game-cta" onClick={() => fire("restart")}>
        Restart
      </button>
      <button type="button" onClick={() => fire("boardroom")}>
        Return to boardroom
      </button>
      <button type="button" onClick={() => fire("website")}>
        Return to website
      </button>
    </>
  );
}
