/* ---------------------------------------------------------------------------
   The Boardroom — type definitions.
   Story data and engine logic stay separate from presentation (Boardroom.tsx)
   and from art (placeholderArt.ts).
--------------------------------------------------------------------------- */

/** Governance perspectives from the essay's literature (Task 03). */
export type PerspectiveId = "friedman" | "hart-zingales" | "freeman";

/** The assignment's two mini-cases. */
export type CaseId = "emissions" | "closure";

/** Placeholder scene ids — mapped to the supplied art pack's backgrounds. */
export type SceneId =
  | "office"
  | "boardroom"
  | "emissions-factory"
  | "closure-factory"
  | "game-over";

/** BYTE expressions available in the supplied sprite set. */
export type StoryExpr =
  | "neutral"
  | "happy"
  | "confused"
  | "worried"
  | "shocked"
  | "relieved";

/** Internal state flags tracked across rounds (no scores, no grades). */
export interface GameFlags {
  /** examined the valuation / material information before deciding */
  investigated: boolean;
  /** examined legal and contractual obligations */
  examinedLegal: boolean;
  /** sought informed shareholder authorization where relevant */
  soughtAuthorization: boolean;
  /** considered employees / community */
  consideredStakeholders: boolean;
  /** modeled reputational / operational consequences */
  examinedValue: boolean;
  /** chose to close immediately, without examining obligations */
  closedImmediately: boolean;
  /** announced the transition before examining anything */
  announcedTransition: boolean;
  /** ignored dissenting shareholders and proceeded */
  ignoredDissent: boolean;
  /** made a unilateral public commitment of company resources */
  unilateralCommitment: boolean;
  /** round 3, emissions: advocated regulation or carbon pricing */
  advocatedRegulation: boolean;
  /** round 3, closure: approved the orderly, obligation-consistent closure */
  choseOrderly: boolean;
  /** round 3, closure: granted management unrestricted discretion */
  choseDiscretion: boolean;
}

export const emptyFlags = (): GameFlags => ({
  investigated: false,
  examinedLegal: false,
  soughtAuthorization: false,
  consideredStakeholders: false,
  examinedValue: false,
  closedImmediately: false,
  announcedTransition: false,
  ignoredDissent: false,
  unilateralCommitment: false,
  advocatedRegulation: false,
  choseOrderly: false,
  choseDiscretion: false,
});

/** Everything a dialogue line or ending may need. */
export interface StoryContext {
  name: string;
  perspective: PerspectiveId;
  flags: GameFlags;
}

export interface Choice {
  id: string;
  label: string;
  setFlags?: (keyof GameFlags)[];
  /** Lines BYTE speaks immediately after the choice. */
  consequence: (ctx: StoryContext) => string[];
}

export interface Round {
  scene: SceneId;
  /** BYTE's expression while this round plays (defaults to neutral). */
  byteExpr?: StoryExpr;
  /** One-line situation narration shown above BYTE's dialogue. */
  situation: string;
  /** BYTE's lines opening the round (may depend on context). */
  byte: (ctx: StoryContext) => string[];
  choices: Choice[];
}

export interface Ending {
  id: string;
  title: string;
  scene: SceneId;
  /** BYTE's expression on the ending screen (defaults to happy). */
  byteExpr?: StoryExpr;
  /** First matching ending wins; evaluated after round 3. */
  condition: (ctx: StoryContext) => boolean;
  lines: (ctx: StoryContext) => string[];
}

export interface StoryCase {
  id: CaseId;
  label: string;
  /** One-sentence introduction using the assignment's actual figures. */
  intro: string;
  rounds: Round[];
  endings: Ending[];
}

export interface PerspectiveOption {
  id: PerspectiveId;
  label: string;
  association: string;
  description: string;
  reaction: string;
}
