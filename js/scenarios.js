// Asset classes, the future "chapters" and the cumulative game maths.
// The game is one journey: 2026 -> 2031 -> 2046 -> 2050 -> 2055.
// Each learner starts with R10 million in 2026. Whatever they have at the end of a
// chapter is what they invest in the next one. Returns are illustrative, in rand,
// and cumulative over each chapter's period (e.g. 2031 -> 2046 is 15 years).
// Edit them here, or from the Settings panel on the presenter screen.

export const STARTING_CAPITAL = 10_000_000; // R10 million per learner
export const START_YEAR = 2026;

// Colours are from the Mazi palette only.
export const ASSETS = [
  { id: "saEq",   name: "SA Equity",            blurb: "Shares in JSE-listed companies",          colour: "#A65B5C" },
  { id: "saBond", name: "SA Bonds",             blurb: "Loans to the SA government",              colour: "#DDB8B8" },
  { id: "saProp", name: "SA Property",          blurb: "Listed malls, offices and warehouses",    colour: "#8A3A3B" },
  { id: "saCash", name: "SA Cash",              blurb: "Money market - safe, steady interest",    colour: "#A8ACB1" },
  { id: "glEq",   name: "Global Equity",        blurb: "Big companies in the US, Europe and Asia", colour: "#FDCDA2" },
  { id: "glBond", name: "Global Bonds",         blurb: "Loans to foreign governments",            colour: "#E4E6E8" },
  { id: "gold",   name: "Gold & Commodities",   blurb: "Gold, platinum, copper, oil",             colour: "#C39B53" },
];

// Played in this order. Each chapter runs from the previous chapter's year (or 2026).
export const DEFAULT_SCENARIOS = [
  {
    id: "ai-boom",
    year: 2031,
    title: "The AI Boom",
    tagline: "AI assistants run half the world's offices, and tech giants are worth more than whole countries.",
    video: "videos/ai-boom.mp4",
    returns: { saEq: 45, saBond: 40, saProp: 10, saCash: 35, glEq: 110, glBond: 15, gold: 20 },
    lesson: "Global tech giants captured most of the AI gains, so investors who looked offshore were rewarded.",
  },
  {
    id: "green-shift",
    year: 2046,
    title: "The Green Shift",
    tagline: "The world races to net zero, and every battery, wind turbine and electric car needs metals.",
    video: "videos/green-shift.mp4",
    returns: { saEq: 380, saBond: 260, saProp: 190, saCash: 140, glEq: 300, glBond: 85, gold: 450 },
    lesson: "Over 15 years, small yearly differences compound into huge gaps. Shares and commodities left cash far behind - time in the market matters.",
  },
  {
    id: "global-shock",
    year: 2050,
    title: "The Great Slowdown",
    tagline: "A global debt crisis knocks the world into recession and markets panic.",
    video: "videos/global-shock.mp4",
    returns: { saEq: -25, saBond: 30, saProp: -30, saCash: 25, glEq: -35, glBond: 25, gold: 70 },
    lesson: "In a crisis, safe assets like cash, bonds and gold protect your wealth while shares fall. Diversification is your seatbelt.",
  },
  {
    id: "sa-rising",
    year: 2055,
    title: "SA Rising",
    tagline: "Reforms work, load-shedding is a memory and the rand soars.",
    video: "videos/sa-rising.mp4",
    returns: { saEq: 85, saBond: 65, saProp: 60, saCash: 35, glEq: 28, glBond: -5, gold: 5 },
    lesson: "A strong rand makes offshore assets worth less in rand terms, while local assets boom. Recoveries reward those who stay invested.",
  },
];

/** Add fromYear / years to each chapter based on its position. */
export function withYears(scenarios) {
  let prev = START_YEAR;
  return scenarios.map((s) => {
    const year = Number(s.year) || prev + 5;
    const out = { ...s, year, fromYear: prev, years: year - prev };
    prev = year;
    return out;
  });
}

export function portfolioValue(alloc, returns, capital = STARTING_CAPITAL) {
  let total = 0;
  for (const a of ASSETS) {
    const weight = (Number(alloc?.[a.id]) || 0) / 100;
    const r = (Number(returns?.[a.id]) || 0) / 100;
    total += capital * weight * (1 + r);
  }
  return total;
}

/**
 * Replay the game so far.
 * history: [{ roundId, returns }] for every revealed chapter, in order.
 * entriesByRound: { [roundId]: [{ uid, name, alloc, submittedAt }] }
 * A learner who skips a chapter keeps their previous mix. A learner who joins
 * late starts with R10 million in the chapter they join.
 * Returns players sorted by wealth (highest first).
 */
export function computeStandings(history, entriesByRound) {
  const players = new Map();
  for (const h of history || []) {
    const list = entriesByRound?.[h.roundId] || [];
    const byUid = new Map(list.map((e) => [e.uid, e]));
    for (const e of list) {
      if (!players.has(e.uid)) {
        players.set(e.uid, { uid: e.uid, name: e.name, wealth: STARTING_CAPITAL, alloc: e.alloc, joinedAt: e.submittedAt || 0, chapters: 0,
          path: [{ year: h.fromYear ?? START_YEAR, wealth: STARTING_CAPITAL }] });
      }
    }
    for (const p of players.values()) {
      const e = byUid.get(p.uid);
      if (e) { p.alloc = e.alloc; p.name = e.name; }
      p.before = p.wealth;
      p.wealth = portfolioValue(p.alloc, h.returns, p.wealth);
      p.rebalanced = !!e;
      p.chapters += 1;
      p.path.push({ year: h.year, wealth: p.wealth });
    }
  }
  return [...players.values()].sort((a, b) => b.wealth - a.wealth || a.joinedAt - b.joinedAt);
}

/** What R10m would have become with perfect foresight (all-in on the best asset every chapter). */
export function perfectForesight(history) {
  let w = STARTING_CAPITAL;
  for (const h of history || []) w *= 1 + Math.max(...ASSETS.map((a) => Number(h.returns?.[a.id]) || 0)) / 100;
  return w;
}

export function formatRand(v) {
  const sign = v < 0 ? "-" : "";
  return sign + "R" + Math.round(Math.abs(v)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function formatRandShort(v) {
  const sign = v < 0 ? "-" : "";
  const a = Math.abs(v);
  if (a >= 1_000_000_000) return sign + "R" + (a / 1_000_000_000).toFixed(2) + "bn";
  return sign + "R" + (a / 1_000_000).toFixed(a >= 100_000_000 ? 0 : 1) + "m";
}

export function formatPct(p) {
  return (p > 0 ? "+" : "") + Math.round(p) + "%";
}
