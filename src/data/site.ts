/* ---------------------------------------------------------------------------
   Site content: single source of truth.
   Task titles, descriptions and point values come from the professor's term
   assignment sheet (Advanced Corporate Finance, Prof. Dr. Burcin Yurtoglu,
   deadline 21.12.2026). Nothing here is invented; where the group's final
   materials are still outstanding, `status` says so plainly.
--------------------------------------------------------------------------- */

export type TaskStatus = "pending" | "complete";

export interface TaskMeta {
  slug: string;
  /** Real assignment number as printed on the professor's sheet */
  number: string;
  /** Exact title, taken from the assignment where one is given */
  title: string;
  /** Short line for cards / index rows */
  shortTitle: string;
  /** Central question, in the assignment's own terms */
  question: string;
  points: string;
  status: TaskStatus;
  statusLabel: string;
  /** What the page will contain once results are in */
  features: string[];
  /** Assignment's own summary of the task (for the task pages) */
  brief: string[];
}

export const tasks: TaskMeta[] = [
  {
    slug: "/task-1",
    number: "Task 01",
    title: "Event Study on Mergers and Acquisitions",
    shortTitle: "The event study",
    question:
      "Do mergers create value for the shareholders of acquiring companies?",
    points: "10 points",
    status: "pending",
    statusLabel: "In preparation (final results not yet supplied)",
    features: [
      "Market-model estimation for 50 completed US deals (2010–2015)",
      "Abnormal and cumulative abnormal returns around the announcement",
      "Interactive data explorer, once the group's results are final",
      "Direct download of the written submission",
    ],
    brief: [
      "The assignment provides information on 50 M&A announcements by US firms from 2010 to 2015, completed deals above a $100 million size threshold, together with daily stock price series for the acquirers.",
      "Using an event window of t−2 to t+2 around each announcement and an estimation window of t−250 to t−50, the market model is estimated against the S&P 500 to generate expected returns. The analysis reports the properties of the market model (alpha, beta, adjusted R²), the average abnormal return on the announcement day, and the average cumulative abnormal returns over t−1 to t+1 and t−2 to t+2.",
      "On that basis, the write-up answers whether the mergers on average create value for acquiring shareholders, and how sensitive the conclusions are to the choice of windows and to outlying observations.",
    ],
  },
  {
    slug: "/task-2",
    number: "Task 02",
    title: "CEO Compensation: Firm Size, Profitability, and Shareholder Value",
    shortTitle: "CEO compensation",
    question:
      "How are firm size, profitability, and shareholder value linked to what CEOs are paid?",
    points: "10 points",
    status: "pending",
    statusLabel: "In preparation (final results not yet supplied)",
    features: [
      "Compensation of roughly 10,000 CEOs, 2000–2010",
      "Regression evidence on profitability, size, and pay",
      "Interactive statistical results, once the group's analysis is final",
      "Direct download of the written submission",
    ],
    brief: [
      "The assignment works with compensation data for approximately 10,000 CEOs over the 2000–2010 period, including detailed compensation, balance sheet, and income statement information, with firms and their CEOs observed multiple times.",
      "The analysis examines the link between firm size, firm profitability, shareholder value, and CEO compensation: estimating how profitability and size explain log compensation, how estimates change under winsorizing, how sensitive CEO pay is to shareholder value, whether these relationships differ between male and female CEOs, and what omitted variables might bias the simple models.",
    ],
  },
  {
    slug: "/task-3",
    number: "Task 03",
    title:
      "Corporate Social Responsibility and Shareholder-Oriented Governance: Compatibility, Tension, and the Question of Who Decides",
    shortTitle: "CSR & governance",
    question:
      "Is CSR compatible with shareholder-oriented governance, and who should decide?",
    points: "5 points",
    status: "complete",
    statusLabel: "Essay final · The Boardroom playable",
    features: [
      "The group's final essay, summarized with the full document to download",
      "The Boardroom, an optional interactive governance adventure",
      "Both assignment mini-cases: the emissions commitment and the factory closure",
    ],
    brief: [
      "The essay asks to what extent corporate social responsibility is compatible with, or in tension with, shareholder-oriented corporate governance, distinguishing CSR that increases long-run firm value, CSR that reduces firm value but may increase shareholder welfare, and CSR that sacrifices firm value and shareholder wealth for others. And who should decide how these trade-offs are resolved: managers, shareholders, or governments.",
    ],
  },
];

export const teamMembers: { name: string }[] = [
  { name: "Henric Areschoug" },
  { name: "Yibai Chen" },
  { name: "Felix Dimmerling" },
  { name: "Pascal Hardt" },
  { name: "Inett Pees" },
];

export const facts: { label: string; value: string }[] = [
  { label: "Program", value: "Master in Entrepreneurship" },
  { label: "Course", value: "Advanced Corporate Finance" },
  { label: "Supervisor", value: "Prof. Dr. Burcin Yurtoglu" },
  { label: "Submission deadline", value: "December 21, 2026" },
  { label: "Institution", value: "WHU – Otto Beisheim School of Management" },
];

/* --- Documents ------------------------------------------------------------
   Only real, supplied files are listed. A null entry renders as a clearly
   marked pending slot, never as a broken download link.
--------------------------------------------------------------------------- */

export interface DocumentSpec {
  id: string;
  label: string;
  /** file name inside /public/documents, or null while pending */
  docx: string | null;
  pdf: string | null;
}

export const documents: Record<string, DocumentSpec> = {
  "task-1": {
    id: "task-1",
    label: "Task 01 · Event study write-up",
    docx: null,
    pdf: null,
  },
  "task-2": {
    id: "task-2",
    label: "Task 02 · CEO compensation write-up",
    docx: null,
    pdf: null,
  },
  "task-3": {
    id: "task-3",
    label: "Task 03 · CSR essay",
    docx: "Task-03-CSR-Essay.docx",
    pdf: null,
  },
};

/** Verbatim from the essay's introduction: the paper's own summary of its
 *  argument. Do not edit; changes belong in the source document. */
export const essaySummary = `It argues that the answer turns less on whether CSR is socially desirable than on who bears its cost and who authorized it. CSR that increases long-run firm value is, in principle, compatible with shareholder orientation and falls within managers' business judgment. CSR that reduces firm value but increases shareholder welfare is compatible only when shareholders authorize it, subject to applicable legal constraints. CSR that sacrifices both firm value and shareholder wealth for others is in genuine tension with shareholder governance. Taking the strongest stakeholder arguments into account, the essay concludes that the primary responsibility for such transfers generally lies with democratic regulation and taxation, with a bounded role for firms where regulation fails.`;

/* --- Module 04: Reproducibility appendix ---------------------------------- */

export const stataModule = {
  title: "Stata Do-Files & Logs",
  shortTitle: "Stata do-files & logs",
  question:
    "How exactly were the reported results generated? Code and logs, open for inspection.",
  statusLabel: "Structure ready · the group's do-files and logs are pending",
};

/** Variable construction exactly as specified on the professor's assignment
 *  sheet (Task 2). Quoted, not the group's own do-file. */
export const stataAssignmentSnippet = `* Variable construction specified on the assignment sheet (Task 2)
* Quoted from the professor's instructions — the group's own do-files
* will be added below once the final analysis is supplied.

generate Profitability       = ni / at
generate Size                = ln(at)
generate Log_compensation    = ln(tdc1)
generate Log_cashpayments    = ln(salary + bonus + othcomp)
generate Log_ltip            = ln(ltip)

* compensation figures are reported in 1000s of USD;
* other variables are reported in millions of USD.`;

/* --- Task 03: the essay's three-pillar framework (content from the essay) --- */

export interface CsrPillar {
  id: string;
  label: string;
  association: string;
  verdict: string;
  decider: string;
}

export const csrPillars: CsrPillar[] = [
  {
    id: "type-1",
    label: "Value-enhancing CSR",
    association: "Compatible with Friedman's benchmark",
    verdict:
      "CSR that increases long-run firm value is, in principle, compatible with shareholder orientation and falls within managers' business judgment.",
    decider: "Managers decide",
  },
  {
    id: "type-2",
    label: "Shareholder welfare",
    association: "Hart & Zingales",
    verdict:
      "CSR that reduces firm value but increases shareholder welfare is compatible only when shareholders authorize it, subject to applicable legal constraints.",
    decider: "Shareholders decide",
  },
  {
    id: "type-3",
    label: "Stakeholder transfers",
    association: "Freeman's tradition, read cautiously",
    verdict:
      "CSR that sacrifices both firm value and shareholder wealth for others is in genuine tension with shareholder governance; the primary responsibility lies with democratic regulation and taxation.",
    decider: "Governments decide",
  },
];

export interface MiniCase {
  id: string;
  label: string;
  figures: string;
  question: string;
  verdict: string;
}

export const miniCases: MiniCase[] = [
  {
    id: "emissions",
    label: "Mini-Case 1 · The Costly Emissions Commitment",
    figures: "€120m cost · €80m PV benefits · −€40m NPV",
    question: "Is the investment consistent with shareholder-oriented governance?",
    verdict:
      "Not as proposed, on the figures given. The essay concludes it requires informed shareholder approval within applicable legal constraints or, preferably, regulation.",
  },
  {
    id: "closure",
    label: "Mini-Case 2 · Closing the Profitable Factory",
    figures: "€150m gain · 1,200 jobs · €60m transition cost",
    question: "Should the board approve management's five-year plan?",
    verdict:
      "The transition is justified insofar as it meets legal obligations, protects long-run value, or is endorsed by shareholders.",
  },
];
