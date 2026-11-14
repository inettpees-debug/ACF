import type { SceneId } from "./types";

/* ---------------------------------------------------------------------------
   Asset manifest — The Boardroom.
   The game currently runs in PLACEHOLDER ART mode (wireframe blocks, drawn in
   code). When the team supplies the approved pixel-art pack, drop the files
   into /public/game/ as named below and swap the loader in placeholderArt.ts;
   the game logic, canvas size and pixel grid do not change.
--------------------------------------------------------------------------- */

export interface AssetSpec {
  file: string;
  description: string;
  nativeSize: string;
  frames?: string;
  status: "placeholder" | "expected";
}

export const GAME_CANVAS = { w: 320, h: 180 } as const;
export const TILE_GRID = 16 as const;

export const assetManifest: AssetSpec[] = [
  {
    file: "byte_sprite_sheet.png",
    description:
      "BYTE, one master sprite: idle, talking, blinking, happy, confused, worried, shocked. Must keep identical proportions, face, hair, glasses, clothing, outline and palette across all frames.",
    nativeSize: "per approved reference (single sheet)",
    frames: "7 animations, 2–4 frames each",
    status: "expected",
  },
  {
    file: "office_background.png",
    description:
      "BYTE's office: desk, computer, plant, large window, daylight, warm colors.",
    nativeSize: "320 × 180",
    status: "expected",
  },
  {
    file: "boardroom_background.png",
    description:
      "Bright boardroom: warm wooden table, chairs, plants, windows with city view.",
    nativeSize: "320 × 180",
    status: "expected",
  },
  {
    file: "emissions_factory.png",
    description: "Chemical plant: simple industrial building, green surroundings, blue sky.",
    nativeSize: "320 × 180",
    status: "expected",
  },
  {
    file: "closure_factory.png",
    description:
      "Factory exterior with gate and small community details (houses, people hints).",
    nativeSize: "320 × 180",
    status: "expected",
  },
  {
    file: "briefcase.png",
    description: "Pixel laptop bag for the firing sequence, dropped to the floor.",
    nativeSize: "≈ 24 × 18",
    status: "expected",
  },
  {
    file: "palette.json",
    description:
      "Shared palette definition for all game art. Until supplied, the wireframe palette below is used.",
    nativeSize: "—",
    status: "expected",
  },
];

/** Wireframe palette used while in placeholder mode. */
export const placeholderPalette = {
  bg: "#0e1622",
  bgGameOver: "#05080d",
  stroke: "#8b93a3",
  strokeDim: "#3a4353",
  accent: "#3fa08f",
  orange: "#d08040",
  label: "#a8b0bd",
} as const;

export const sceneName: Record<SceneId, string> = {
  office: "BYTE'S OFFICE",
  boardroom: "THE BOARDROOM",
  "emissions-factory": "CHEMICAL PLANT",
  "closure-factory": "THE FACTORY GATE",
  "game-over": "",
};
