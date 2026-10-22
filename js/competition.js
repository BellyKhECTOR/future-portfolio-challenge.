// ---------------------------------------------------------------------------
// FUTURE PORTFOLIO CHALLENGE - online competition settings (public).
// Do NOT put the returns in this file: the site is public. The returns are entered on results.html and are
// stored privately in the database.
// ---------------------------------------------------------------------------

export const COMPETITION = {
  title: "Future Portfolio Challenge",
  videoUrl: "videos/competition.mp4",
  contactEmail: "",                                    // optional: shown in the terms for questions
};

// The two chapters (wording only - no returns here).
export const COMP_CHAPTERS = [
  {
    key: "alloc1", n: 1, from: 2026, to: 2031, title: "The AI Boom",
    news: [
      "AI now does half the world's office work",
      "US and Asian tech giants are worth more than whole countries",
      "Local firms are slower to adopt AI - interest rates are steady",
    ],
  },
  {
    key: "alloc2", n: 2, from: 2031, to: 2036, title: "The Great Slowdown",
    news: [
      "A global debt crisis shakes markets and recession hits",
      "Investors rush to safety: gold, cash and government bonds",
      "Diversification is your seatbelt",
    ],
  },
];
