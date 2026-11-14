import type { SceneId } from "./types";

/* ---------------------------------------------------------------------------
   Sprite art renderer — THE BOARDROOM asset pack (public/game).
   Contract (assets/manifest.json + STYLE_RULES.md):
   - Logical screen 192 × 108 art px, nearest-neighbour, integer display scales.
   - BYTE: 60 × 60 at 1×, placed at x = −4, y = 48 (bottom-anchored, partially
     off the left edge by design).
   - Backgrounds: 192 × 108, detail right, area behind BYTE kept plain.
   - Briefcase FX: 9-frame sheet, cell 40 × 72, placed at (76, 1), black bg.
--------------------------------------------------------------------------- */

export const GAME_W = 192;
export const GAME_H = 108;

export type ByteExpr =
  | "neutral"
  | "talk2"
  | "blink"
  | "happy"
  | "confused"
  | "worried"
  | "shocked"
  | "relieved";

const BYTE_FILES: Record<ByteExpr, string> = {
  neutral: "byte/BYTE_neutral_and_talking_part_1.png",
  talk2: "byte/BYTE_talking_part_2.png",
  blink: "byte/BYTE_neutral_eyes_closed.png",
  happy: "byte/BYTE_happy.png",
  confused: "byte/BYTE_confused.png",
  worried: "byte/BYTE_worried.png",
  shocked: "byte/BYTE_shocked.png",
  relieved: "byte/BYTE_relieved.png",
};

const BG_FILES: Partial<Record<SceneId, string>> = {
  office: "backgrounds/bg_office_1x.png",
  boardroom: "backgrounds/bg_boardroom_1x.png",
  "emissions-factory": "backgrounds/bg_factory_emissions_1x.png",
  "closure-factory": "backgrounds/bg_factory_closure_1x.png",
};

/* Briefcase FX — timings from fx/briefcase_drop_sheet_1x.json */
const FX = {
  sheet: "fx/briefcase_drop_sheet_1x.png",
  cell: { w: 40, h: 72 },
  frames: 9,
  ms: [70, 60, 50, 40, 120, 80, 70, 100, 900],
  place: { x: 76, y: 1 },
  total: 70 + 60 + 50 + 40 + 120 + 80 + 70 + 100 + 900,
  reducedFrame: 8,
} as const;

export const FIRED_FX_MS = FX.total;

function load(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error(`art load failed: ${src}`));
    el.src = `/game/${src}`;
  });
}

export class Art {
  readonly byte = new Map<ByteExpr, HTMLImageElement>();
  readonly bg = new Map<string, HTMLImageElement>();
  fx: HTMLImageElement | null = null;

  static async load(): Promise<Art> {
    const art = new Art();
    await Promise.all([
      ...Object.entries(BYTE_FILES).map(async ([expr, file]) => {
        art.byte.set(expr as ByteExpr, await load(file));
      }),
      ...Object.values(BG_FILES).map(async (file) => {
        art.bg.set(file, await load(file));
      }),
      load(FX.sheet).then((el) => {
        art.fx = el;
      }),
    ]);
    return art;
  }
}

export interface DrawOptions {
  scene: SceneId;
  byte: ByteExpr;
  /** ms since the firing sequence started; null when not firing */
  briefcaseElapsed: number | null;
  reducedMotion: boolean;
}

export function drawFrame(
  canvas: HTMLCanvasElement,
  art: Art,
  opts: DrawOptions,
) {
  const c = canvas.getContext("2d");
  if (!c) return;
  c.imageSmoothingEnabled = false;

  if (opts.scene === "game-over") {
    c.fillStyle = "#000000";
    c.fillRect(0, 0, GAME_W, GAME_H);
    if (!art.fx) return;

    let frame = FX.frames - 1;
    if (opts.reducedMotion) {
      frame = FX.reducedFrame;
    } else if (opts.briefcaseElapsed != null) {
      let acc = 0;
      frame = FX.frames - 1;
      for (let i = 0; i < FX.frames; i++) {
        acc += FX.ms[i];
        if (opts.briefcaseElapsed < acc) {
          frame = i;
          break;
        }
      }
    } else {
      frame = 0;
    }
    c.drawImage(
      art.fx,
      frame * FX.cell.w,
      0,
      FX.cell.w,
      FX.cell.h,
      FX.place.x,
      FX.place.y,
      FX.cell.w,
      FX.cell.h,
    );
    return;
  }

  const bgFile = BG_FILES[opts.scene];
  const bg = bgFile ? art.bg.get(bgFile) : null;
  if (bg) {
    c.drawImage(bg, 0, 0, GAME_W, GAME_H);
  } else {
    c.fillStyle = "#fff3dc";
    c.fillRect(0, 0, GAME_W, GAME_H);
  }

  const byteImg = art.byte.get(opts.byte);
  if (byteImg) {
    c.drawImage(byteImg, -4, 48, 60, 60);
  }
}
