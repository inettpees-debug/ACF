# The Boardroom — Visual Style Rules

## Grid and scale
- **Art pixel:** the unit of all pixel art. The supplied BYTE portraits are 60×60 art px, stored at 10× (600×600, exact 10×10 blocks).
- **Game screen:** **192×108 art px** (16:9). Display only at integer scales, with nearest-neighbour rendering (`image-rendering: pixelated`):
  - 3× = 576×324 (mobile)
  - 5× = 960×540
  - 10× = 1920×1080
- Every new asset is drawn at 1× on this grid. No rotation, no fractional scaling, no mixed pixel sizes.
- "25×25" from the earlier to-do is retired: it doesn't match the supplied art.

## Layout contract (192×108)
| Element | Position (art px) |
|---|---|
| BYTE sprite (60×60) | x = −4, y = 48, bottom-anchored; visible x 10–48 |
| Dialogue box (HTML overlay) | x 58–187, y 74–104 |
| Permanent controls (HTML overlay) | top-right strip, outside scene detail |

Backgrounds keep the area behind BYTE (x 0–55, y 40–108) light and plain. Detail goes on the right.

## Colour
- The master palette is `src/palette.py`, also exported as `assets/palette/*`.
- The **BYTE group is locked.** Never edit, merge or remap those 17 values.
- Scene budget: ≤ 24 environment colours per background.
- Scenes are bright and warm: cream walls, pale sky, soft blue city, fresh greens. No dark or dystopian values in backgrounds.
- UI accent comes from the supplied logo: orange `#ffbd59`, yellow `#ffdb70`, shadow `#c9944a` and black. The website teal `#4f9e96` is used sparingly in props.

## Rendering
- **No outlines.** BYTE has none, so forms separate by value only.
- Flat cel shading, 2–3 tones per material.
- **Light from the upper left.** Shadows fall on the right and bottom faces.
- No dithering, no antialiasing, no semi-transparent pixels in pixel art.
- Skies use flat horizontal bands of irregular height.
- Small round things (sun, coins, particles) are drawn as hand-placed pixel shapes.

## Supplied text graphics (logo, winner, game-over)
- These are smooth-edged illustrations, not grid art. Show them as overlays at their own size, scaled smoothly in CSS. Do not place them on the pixel canvas or force integer scaling.
- Transparent versions are in `assets/endings/` (white background removed; card artwork untouched). The originals are kept as `source_*.png`.
- The winner graphic says **"NICE CFO"** while the player is the acting CEO. This is still open.

## Typography
- **Pixelify Sans** (Google Fonts, OFL) for all game text. Host it with the site.
- Dialogue ≥ 16 CSS px. All game text is real HTML text, not baked into images.

## Animation (visual only, no audio)
- **BYTE talking:** alternate `neutral_and_talking_part_1` and `talking_part_2` at about 150 ms per frame, only while a line is shown on the neutral face. Other expressions are held still.
- **BYTE blinking:** `neutral_eyes_closed` for about 120 ms every 3–5 s (randomised), neutral face only.
- **Dialogue text:** appears instantly (no typewriter).
- **prefers-reduced-motion:** no talking or blinking cycles, static loading dots, and no briefcase fall (the final frame is shown instead).

## Workflow
- Each asset has a build script in `src/`. Edit the script and re-run it. Never hand-edit exported PNGs.
- Run `python3 src/check_assets.py` before handing assets to the game build.
