// Asset classes and the default "future" scenarios.
// Returns are illustrative cumulative returns over a 5-year horizon (in %).
// Edit them here, or from the Settings panel on the presenter screen.

export const STARTING_CAPITAL = 10_000_000; // R10 million per learner

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

export const DEFAULT_SCENARIOS = [
  {
    id: "ai-boom",
    title: "The AI Boom",
    tagline: "2031: AI assistants run half the world's offices.",
    video: "videos/ai-boom.mp4",
    returns: { saEq: 45, saBond: 40, saProp: 10, saCash: 35, glEq: 110, glBond: 15, gold: 20 },
    lesson: "Global tech giants captured most of the AI gains, and SA investors who looked offshore were rewarded.",
  },
  {
    id: "green-shift",
    title: "The Green Shift",
    tagline: "2031: The world races to net zero and needs metals to do it.",
    video: "videos/green-shift.mp4",
    returns: { saEq: 55, saBond: 45, saProp: 25, saCash: 35, glEq: 40, glBond: 12, gold: 90 },
    lesson: "Batteries, solar and EVs need platinum, copper and manganese, and South Africa digs them up.",
  },
  {
    id: "global-shock",
    title: "The Great Slowdown",
    tagline: "2031: A global debt crisis knocks the world into recession.",
    video: "videos/global-shock.mp4",
    returns: { saEq: -25, saBond: 30, saProp: -30, saCash: 40, glEq: -35, glBond: 25, gold: 70 },
    lesson: "In a crisis, safe assets like cash, bonds and gold protect your money while shares fall.",
  },
  {
    id: "sa-rising",
    title: "SA Rising",
    tagline: "2031: Reforms work, load-shedding is history and the rand soars.",
    video: "videos/sa-rising.mp4",
    returns: { saEq: 85, saBond: 65, saProp: 60, saCash: 35, glEq: 28, glBond: -5, gold: 5 },
    lesson: "A strong rand makes offshore assets worth less in rand terms, while local assets boom.",
  },
];

export function portfolioValue(alloc, returns, capital = STARTING_CAPITAL) {
  let total = 0;
  for (const a of ASSETS) {
    const weight = (Number(alloc?.[a.id]) || 0) / 100;
    const r = (Number(returns?.[a.id]) || 0) / 100;
    total += capital * weight * (1 + r);
  }
  return total;
}

export function formatRand(v) {
  const sign = v < 0 ? "-" : "";
  return sign + "R" + Math.round(Math.abs(v)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function formatRandShort(v) {
  const sign = v < 0 ? "-" : "";
  return sign + "R" + (Math.abs(v) / 1_000_000).toFixed(2) + "m";
}

export function formatPct(p) {
  return (p > 0 ? "+" : "") + Math.round(p) + "%";
}
