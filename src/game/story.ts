import type {
  Ending,
  PerspectiveOption,
  Round,
  StoryCase,
  StoryContext,
} from "./types";

/* ---------------------------------------------------------------------------
   The Boardroom — story data.
   Dialogue, choices, consequences and endings live here as structured data.
   Figures are the assignment's own: €120m cost / €80m PV benefits / −€40m NPV;
   €150m relocation gain / 1,200 jobs / €60m transition cost / €90m remaining.
   Persuasive lines are BYTE being BYTE — they are not academic quotations.
--------------------------------------------------------------------------- */

export const perspectives: PerspectiveOption[] = [
  {
    id: "friedman",
    label: "Shareholder wealth and managerial authorization",
    association: "Milton Friedman",
    description:
      "Managerial responsibility, shareholder resources, profit within the rules of the game — and the problem of managers spending resources without proper authorization.",
    reaction:
      "Ah, Friedman. Old friend. Profits, principles and absolutely no surprise philanthropy. Let's see where this takes us.",
  },
  {
    id: "hart-zingales",
    label: "Shareholder welfare",
    association: "Hart & Zingales",
    description:
      "Shareholders may value social outcomes and may willingly accept lower financial returns for outcomes they consider worthwhile.",
    reaction:
      "Interesting. Shareholders with feelings. Who would have thought?",
  },
  {
    id: "freeman",
    label: "Stakeholder interests",
    association: "Freeman",
    description:
      "The legitimate interests of employees, communities, suppliers, and others affected by corporate decisions.",
    reaction:
      "Stakeholders! Everywhere! Employees, communities, suppliers... I hope you brought a sufficiently large spreadsheet.",
  },
];

/* --- Shared round pieces ----------------------------------------------------- */

const perspectiveCloser: Record<
  PerspectiveOption["id"],
  { emissions: string[]; closure: string[] }
> = {
  friedman: {
    emissions: [
      "Friedman would have questions. Several. In writing.",
      "Something about an unelected official imposing a tax — his words, not mine. I just work here.",
    ],
    closure: [
      "Friedman nods at the arithmetic. Then he asks who authorized the sociology.",
      "A levy on shareholders, spent on regional employment policy — his favorite kind of nightmare.",
    ],
  },
  "hart-zingales": {
    emissions: [
      "Hart and Zingales would ask the shareholders how they feel about clean air.",
      "Feelings, it turns out, are an asset class. Who knew.",
    ],
    closure: [
      "Hart and Zingales would put the voluntary part to a vote. It's their whole move.",
      "If the shareholders value the community, let the shareholders say so — with their own dividend.",
    ],
  },
  freeman: {
    emissions: [
      "Freeman is pleased. The employees are pleased. The atmosphere is, in principle, pleased.",
      "The spreadsheet, however, remains exactly as large as I warned.",
    ],
    closure: [
      "Freeman smiles on you. Twelve hundred stakeholders sleep a little easier.",
      "Whether the shareholders smile too is, tragically, also a governance question.",
    ],
  },
};

/* --- Case 01 — The emissions commitment ---------------------------------------- */

const emissionsRound1: Round = {
  scene: "boardroom",
  byteExpr: "neutral",
  situation:
    "The board convenes. On the table: a voluntary emissions investment that goes far beyond legal requirements.",
  byte: (ctx) => [
    `Good morning, ${ctx.name}. The board wants to approve the €120 million investment.`,
    "Expected financial benefits are €80 million. That's a €40 million negative NPV. What is your move?",
  ],
  choices: [
    {
      id: "approve",
      label: "Approve it immediately — the board has made its position clear.",
      consequence: (ctx) => {
        if (ctx.perspective === "friedman")
          return [
            "Bold. Spending shareholder money the moment someone asks for it.",
            "The rules of the game, I remind you, did not include a 'because we meant well' exception.",
          ];
        if (ctx.perspective === "hart-zingales")
          return [
            "Approved on the spot. The shareholders whose welfare you are maximizing might have wanted to see the receipts first.",
            "Welfare is not the same thing as surprise.",
          ];
        return [
          "Approved! For the planet! I admire the speed.",
          `I merely note, ${ctx.name}, that the €40 million hole has not gone anywhere.`,
        ];
      },
    },
    {
      id: "review",
      label:
        "Ask for a full review of the valuation and the risks it may have left out.",
      setFlags: ["investigated"],
      consequence: () => [
        "Excellent instinct. The €80 million already assumes optimistic reputation, regulatory-risk and hiring benefits.",
        "A complete valuation would also show what it assumes about future carbon pricing, litigation exposure, and stranded assets.",
        "If those channels were undervalued, part of the 'sacrifice' is mispriced investment, not generosity. The board can't presume that, though — the burden of proof sits with the proposal.",
        "Now it is at least an informed minus €40 million.",
      ],
    },
    {
      id: "reject",
      label: "Reject it — a negative NPV is a negative NPV.",
      consequence: (ctx) => {
        if (ctx.perspective === "friedman")
          return [
            "Discipline. Friedman sheds a single, dignified tear.",
            "Although — he does accept spending that serves the firm's long-run interest, even when it's labeled CSR. The question is whether this is that.",
          ];
        if (ctx.perspective === "hart-zingales")
          return [
            "Rejected on the stated figures. Defensible.",
            "Though if the shareholders themselves would pay for cleaner air, you have just declined a purchase they wanted to make.",
          ];
        return [
          "Rejected. The emissions continue. The community notices.",
          "A defensible business judgment — and a fascinating conversation at the next town hall.",
        ];
      },
    },
  ],
};

const emissionsRound2: Round = {
  scene: "boardroom",
  byteExpr: "worried",
  situation:
    "The project remains value-negative on the stated figures — but some shareholders value the emissions reduction itself.",
  byte: () => [
    "Apparently, some investors care about the emissions themselves. What now?",
  ],
  choices: [
    {
      id: "vote",
      label:
        "Put it to the shareholders — the €40 million cost disclosed in full before any vote.",
      setFlags: ["soughtAuthorization"],
      consequence: () => [
        "Full disclosure, then a vote. If it passes, the majority has knowingly accepted the cost.",
        "Fair warning from the literature: a majority vote does not vanish the minority's loss, and it does not override corporate law, directors' duties, or securities disclosure.",
        "Authorization solves the agency problem. The distributive question between shareholders it merely, well, organizes.",
      ],
    },
    {
      id: "board-decides",
      label: "Let the board decide — that is what boards are for.",
      consequence: (ctx) => {
        if (ctx.perspective === "friedman")
          return [
            "The board, deciding how much of the shareholders' money to spend on the environment.",
            "Friedman calls that an appointed civil servant imposing an unappointed tax. He can be dramatic. He is also not entirely wrong.",
          ];
        return [
          "The board nods gravely and decides.",
          "Whether it may decide this for the shareholders — rather than with them — is precisely what the essay you are standing in argues about.",
        ];
      },
    },
    {
      id: "ignore",
      label: "Ignore the dissenting shareholders and proceed.",
      setFlags: ["ignoredDissent"],
      consequence: () => [
        "The dissenters have been filed under 'later'.",
        "Later is a famous place where governance problems mature into litigation.",
      ],
    },
  ],
};

const emissionsRound3: Round = {
  scene: "emissions-factory",
  byteExpr: "confused",
  situation:
    "Final decision day. The plant hums. The numbers have not changed: €120 million out, €80 million back, minus €40 million net.",
  byte: () => [
    "The board awaits your final word, and I, as ever, merely observe. And take minutes. And judge silently.",
  ],
  choices: [
    {
      id: "authorize",
      label:
        "Seek informed shareholder authorization before committing the company.",
      setFlags: ["soughtAuthorization"],
      consequence: () => [
        "The resolution is drafted: the cost stated, the sacrifice named, the vote scheduled.",
        "Whatever passes will pass with open eyes — and remain inside applicable law and minority protections.",
      ],
    },
    {
      id: "regulate",
      label:
        "Advocate consistent environmental standards or carbon pricing for the whole industry instead.",
      setFlags: ["advocatedRegulation"],
      consequence: () => [
        "A carbon price would make everyone internalize the externality — not just one firm's owners.",
        "The company supports the regulation and keeps its capital free until it applies to everyone. Clever. Possibly even right.",
      ],
    },
    {
      id: "unilateral",
      label: "Commit publicly, right now, on your own authority.",
      setFlags: ["unilateralCommitment"],
      consequence: () => [
        "The press release writes itself: bold leadership, cleaner skies.",
        "The authorization question writes itself too. Who, exactly, agreed to pay for this?",
      ],
    },
  ],
};

const emissionsEndings: Ending[] = [
  {
    id: "mandate",
    title: "THE MANDATE",
    scene: "emissions-factory",
    byteExpr: "happy",
    condition: (ctx) =>
      ctx.flags.soughtAuthorization &&
      !ctx.flags.advocatedRegulation &&
      !ctx.flags.unilateralCommitment,
    lines: (ctx) => [
      `The shareholders voted, ${ctx.name}. The €40 million cost was disclosed before the ballot, and they knowingly accepted the sacrifice.`,
      "The investment proceeds — subject to applicable law, directors' duties, and the protections minority shareholders keep in any case.",
      "Under the shareholder-welfare view this is not waste: their money, their values, their authorization.",
      ...perspectiveCloser[ctx.perspective].emissions,
    ],
  },
  {
    id: "level-field",
    title: "THE LEVEL PLAYING FIELD",
    scene: "boardroom",
    byteExpr: "relieved",
    condition: () => true,
    lines: (ctx) => [
      "You told the board: not one firm's shareholders paying alone.",
      "The company now supports a consistent emissions standard and carbon pricing — the externality internalized for every competitor, decided where such decisions belong.",
      "Your own capital stays free, your conscience stays busy, and the atmosphere gets its day in parliament.",
      ...perspectiveCloser[ctx.perspective].emissions,
    ],
  },
];

const charityFund: Ending = {
  id: "charity-fund",
  title: "THE CEO'S PERSONAL CHARITY FUND",
  scene: "boardroom",
  byteExpr: "worried",
  condition: () => true,
  lines: (ctx) => [
    `You committed €40 million of other people's money on your own judgment, ${ctx.name}, without a mandate.`,
    "The board papers call it leadership. Friedman calls it taxation without representation. The emissions do fall — but who paid, and who decided, have become uncomfortable questions.",
    "The company proceeds. Your authority proceeds rather less smoothly.",
    ...perspectiveCloser[ctx.perspective].emissions,
  ],
};

/* --- Case 02 — The factory closure ----------------------------------------------- */

const closureRound1: Round = {
  scene: "boardroom",
  byteExpr: "neutral",
  situation:
    "A profitable factory, an aging site, a region where the company is the largest private employer.",
  byte: (ctx) => [
    `Right, ${ctx.name}. Relocating the factory could increase the present value of profits by €150 million.`,
    "Unfortunately, 1,200 employees are about to become a very inconvenient line in the annual report. A gradual transition would cost shareholders €60 million.",
  ],
  choices: [
    {
      id: "close-now",
      label: "Close it immediately.",
      setFlags: ["closedImmediately"],
      consequence: () => [
        "Decisive. Immediate closure, €150 million banked, one thousand two hundred people informed by email on a Friday.",
        "Assuming immediate closure is even available — notice periods and consultation duties have opinions about Fridays.",
      ],
    },
    {
      id: "investigate",
      label: "Investigate the legal and contractual obligations first.",
      setFlags: ["examinedLegal", "investigated"],
      consequence: () => [
        "Notice periods, severance, consultation requirements, any mandatory social plan — the unglamorous infrastructure of not being sued.",
        "Some of that €60 million may not be discretionary at all. It was never generosity if it was already owed.",
      ],
    },
    {
      id: "announce",
      label: "Announce a gradual transition immediately.",
      setFlags: ["announcedTransition"],
      consequence: () => [
        "A five-year plan, retraining included, announced with warm lighting and sincere adjectives.",
        "€60 million of shareholder value committed in one press conference. The details will catch up later. Details usually do.",
      ],
    },
  ],
};

const closureRound2: Round = {
  scene: "office",
  byteExpr: "confused",
  situation:
    "The due-diligence pile lands on the acting CEO's desk: contracts, laws, people, reputation.",
  byte: () => [
    "Notice periods, consultation, contractual commitments, severance, retraining and a local community that has depended on this employer for decades.",
    "Annoyingly, these things matter.",
  ],
  choices: [
    {
      id: "map-legal",
      label: "Map every legal and contractual obligation to the last clause.",
      setFlags: ["examinedLegal", "investigated"],
      consequence: () => [
        "The obligations are now a precise number, not a vibe. A meaningful part of the transition plan binds the firm regardless of philosophy.",
        "The baseline was never 'immediate closure'. It is the least costly closure that meets the law and the contracts.",
      ],
    },
    {
      id: "listen",
      label: "Go listen to the employees and the community.",
      setFlags: ["consideredStakeholders", "investigated"],
      consequence: (ctx) => [
        "Twenty-two years of firm-specific skills. A town built around one gate. Expectations the company itself spent decades encouraging.",
        "Contract law calls these people claimants. Standing in the rain outside the gate, they mostly call themselves the neighborhood.",
        ctx.perspective === "freeman"
          ? "Freeman would say you have finally met the actual subjects of the spreadsheet."
          : "Legitimate interests — the essay concedes this much — are not the same as a managerial blank check.",
      ],
    },
    {
      id: "model-value",
      label: "Model the reputational and operational consequences.",
      setFlags: ["examinedValue", "investigated"],
      consequence: () => [
        "Remaining employees watching how colleagues are treated. Customers reading the news. Productivity during the phase-out.",
        "Some of the €60 million buys back value the closure would destroy. That part is investment, not charity.",
      ],
    },
  ],
};

const closureRound3: Round = {
  scene: "closure-factory",
  byteExpr: "worried",
  situation:
    "The final board meeting. Outside the gate, the town; inside the spreadsheet, €150 million minus whatever decency costs.",
  byte: () => [
    "The board is seated. The community is outside. The shareholders are everywhere and nowhere. Your call, chief.",
  ],
  choices: [
    {
      id: "orderly",
      label:
        "Approve a closure that meets every obligation and preserves the firm's long-run interests.",
      setFlags: ["choseOrderly"],
      consequence: () => [
        "The obligation baseline is honored in full; value-preserving measures stay; the purely voluntary remainder goes unapproved.",
        "Workers are supported through required and negotiated measures. The largest possible slice of the €150 million stays with the owners.",
      ],
    },
    {
      id: "endorse",
      label:
        "Send the plan to the shareholders: obligations as baseline, the voluntary €60 million disclosed as what it is.",
      setFlags: ["soughtAuthorization"],
      consequence: () => [
        "A clean vote on a clean number: how much of the gain the owners are willing to spend on the transition.",
        "If it passes, the five-year plan proceeds with a mandate. €90 million of the relocation gain remains either way.",
      ],
    },
    {
      id: "discretion",
      label:
        "Give management unrestricted discretion to balance stakeholder interests.",
      setFlags: ["choseDiscretion"],
      consequence: () => [
        "An open-ended mandate: balance everyone's interests, at the shareholders' expense, by whatever standard management prefers.",
        "It sounds humane. It is also unaccountable — every master served, no duty measurable.",
      ],
    },
  ],
};

const closureEndings: Ending[] = [
  {
    id: "endorsed",
    title: "THE ENDORSED TRANSITION",
    scene: "closure-factory",
    byteExpr: "happy",
    condition: (ctx) =>
      ctx.flags.soughtAuthorization && !ctx.flags.choseDiscretion,
    lines: (ctx) => [
      "The vote passed. The obligations stand as the baseline, and the shareholders knowingly chose to fund the voluntary balance.",
      "Employees get their five years and their retraining. The community gets time to adapt. The shareholders get something rarer: a decision that was actually theirs.",
      "€90 million of the relocation gain remains — purchased with consent instead of apology.",
      ...perspectiveCloser[ctx.perspective].closure,
    ],
  },
  {
    id: "orderly-exit",
    title: "THE ORDERLY EXIT",
    scene: "closure-factory",
    byteExpr: "relieved",
    condition: () => true,
    lines: (ctx) => [
      "The factory closes on a path that honors every legal and contractual obligation and protects the firm's reputation for keeping its word.",
      "The purely voluntary extras go unapproved — support flows through required and negotiated measures, and the remainder of the gain stays with the shareholders.",
      "Cold? Perhaps. Lawful, value-preserving, and defensible to every constituency that can actually sue or vote.",
      ...perspectiveCloser[ctx.perspective].closure,
    ],
  },
  {
    id: "open-mandate",
    title: "THE OPEN MANDATE",
    scene: "closure-factory",
    byteExpr: "worried",
    condition: () => true,
    lines: (ctx) => [
      "Management now balances stakeholder interests at shareholder expense, by whatever weights it prefers, reviewable by no one in particular.",
      "Multiple performance criteria, no measurable duty — accountability dissolves politely, in a series of well-meaning meetings.",
      "The stakeholders you hoped to protect may find, as Bebchuk and Tallarita warn, that managers without duties protect mainly themselves.",
      ...perspectiveCloser[ctx.perspective].closure,
    ],
  },
];

/* --- Assembled cases -------------------------------------------------------------- */

export const cases: Record<"emissions" | "closure", StoryCase> = {
  emissions: {
    id: "emissions",
    label: "Case 01: The Emissions Commitment",
    intro:
      "A publicly listed chemical company can voluntarily cut emissions far beyond legal requirements: the investment costs €120 million, the expected financial benefits have a present value of only €80 million — a net present value of minus €40 million — and the board wants to proceed anyway.",
    rounds: [emissionsRound1, emissionsRound2, emissionsRound3],
    endings: [emissionsEndings[0], charityFund, emissionsEndings[1]],
  },
  closure: {
    id: "closure",
    label: "Case 02: The Factory Closure",
    intro:
      "Moving production abroad would raise the present value of profits by €150 million, but closing the profitable factory would eliminate 1,200 jobs in a region where the company is the largest private employer; a five-year gradual transition would cost shareholders €60 million.",
    rounds: [closureRound1, closureRound2, closureRound3],
    endings: closureEndings,
  },
};

/* --- Firing conditions ---------------------------------------------------------------- */

export interface FiringRuling {
  fired: boolean;
  grounds: string;
}

/**
 * Firing requires reckless or indefensible decision-making — never the choice
 * of perspective itself. A Friedman player, a Hart & Zingales player and a
 * Freeman player can all reach every successful ending.
 */
export function ruleOnFiring(
  caseId: "emissions" | "closure",
  flags: StoryContext["flags"],
): FiringRuling {
  if (caseId === "emissions") {
    if (flags.unilateralCommitment && flags.ignoredDissent)
      return {
        fired: true,
        grounds:
          "An unauthorized €40 million commitment, made while ignoring dissenting shareholders.",
      };
    if (flags.unilateralCommitment && !flags.investigated)
      return {
        fired: true,
        grounds:
          "A serious financial commitment made without ever examining the available material information.",
      };
  } else {
    if (flags.closedImmediately && !flags.examinedLegal)
      return {
        fired: true,
        grounds:
          "Immediate closure ordered without examining material legal and contractual obligations.",
      };
    if (flags.announcedTransition && !flags.investigated)
      return {
        fired: true,
        grounds:
          "A €60 million commitment announced publicly before any material information was examined.",
      };
  }
  return { fired: false, grounds: "" };
}

/* --- Intro dialogue ------------------------------------------------------------------- */

export function introLines(name: string): string[] {
  return [
    `Well, ${name}, you're the new CEO. Excellent. I hope you enjoy difficult decisions, incomplete information and shareholder meetings.`,
    "We have two situations that require your immediate attention.",
  ];
}

export function perspectiveQuestion(): string {
  return "Before we make any decisions, whose interests are you putting first?";
}
