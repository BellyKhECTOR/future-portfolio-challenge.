# Competition video: rules, two chapters (boom, then crash), and how to enter. No prize or closing date. Includes a short explainer of the 7 investments.
ENTRY_URL = "https://bellykhector.github.io/future-portfolio-challenge./enter.html"

COMP = {
  "id": "competition", "n": 1, "from": 2026, "year": 2031, "title": "The AI Boom", "mood": "bright",
  "question": "Plan your split", "url": ENTRY_URL,
  "scenes": [
    {"type": "title", "hdr": "COMPETITION", "yr": 2026, "bigSize": 150,
     "big": "FUTURE PORTFOLIO <span>CHALLENGE</span>", "tag": "Grow R1000 across two futures",
     "say": "Welcome to the Future Portfolio Challenge, brought to you by Mazi Asset Management. You get one thousand rand to invest, and two trips into the future."},
    {"type": "learn", "icon": "phone", "hdr": "HOW IT WORKS", "yr": 2026, "kicker": "How it works", "exLabel": "THE RULES",
     "head": "Grow R1000 across two futures", "sub": "Chapter 1: 2026 to 2031. Chapter 2: 2031 to 2036.",
     "ex": "Watch the news for clues. For each chapter, split your R1000 across 7 investments so it adds up to 100%. Your wealth carries from chapter 1 into chapter 2.",
     "say": "Here's how it works. You start with one thousand rand of pretend money. We'll jump five years into the future, twice. First to twenty thirty-one, then to twenty thirty-six. For each chapter, watch the news for clues, then split your money across seven investments so it adds up to one hundred percent. Whatever you grow in chapter one carries into chapter two."},
    {"type": "learn", "icon": "rand", "hdr": "HOW TO WIN", "yr": 2026, "kicker": "How to win", "exLabel": "HOW TO ENTER",
     "head": "Highest value in 2036 wins", "sub": "One entry per person. Winners announced after the competition closes.",
     "ex": "Scan the QR code in the corner - or screenshot it - and submit both portfolios on the entry page.",
     "say": "The entry with the highest value in twenty thirty-six wins. To enter, scan the QR code in the corner of your screen, or take a screenshot of it, and submit both of your portfolios on the entry page. One entry per person. The winners will be announced after the competition closes."},

    {"type": "grid", "hdr": "YOUR 7 INVESTMENTS", "yr": 2026, "kicker": "Your 7 investments", "head": "In South Africa",
     "items": [
       {"n": "SA Equity", "c": "#A65B5C", "d": "Own a slice of JSE companies like Shoprite and MTN. Grows most over time, but bumpy."},
       {"n": "SA Bonds", "c": "#DDB8B8", "d": "Lend to the government and earn interest - like lending your cousin R100 and getting R110 back."},
       {"n": "SA Property", "c": "#8A3A3B", "d": "Earn rent from malls, offices and warehouses."},
       {"n": "SA Cash", "c": "#A8ACB1", "d": "Like a savings account. Safe and steady, but slow."}],
     "say": "First, let's meet your seven investments. In South Africa: SA Equity, also called shares, means owning a slice of companies on the Johannesburg Stock Exchange, like Shoprite or MTN. When they make profit selling groceries and airtime, your slice grows. Shares usually grow the most over time, but the ride is bumpy. SA Bonds means lending money to the government and earning interest, like lending your cousin one hundred rand and getting one hundred and ten back. Steadier, but slower. SA Property earns rent from malls, offices and warehouses. And SA Cash is like a savings account at the bank. Safe and steady, but slow."},
    {"type": "grid", "hdr": "YOUR 7 INVESTMENTS", "yr": 2026, "kicker": "Your 7 investments", "head": "Around the world",
     "items": [
       {"n": "Global Equity", "c": "#FDCDA2", "d": "Shares in giants like Apple, Amazon and Samsung."},
       {"n": "Global Bonds", "c": "#E4E6E8", "d": "Loans to governments like the USA and Germany."},
       {"n": "Gold & Commodities", "c": "#C39B53", "d": "Gold, platinum, copper and oil from the ground."}],
     "say": "And around the world: Global Equity means owning shares in giants like Apple, Amazon and Samsung, the makers of the phone in your pocket. Global Bonds are loans to governments like the United States and Germany. And Gold and Commodities are things dug from the ground, like gold, platinum and oil. When the world needs more of them, their prices jump, and gold often rises when people are scared. One more thing: when the rand weakens, overseas investments are worth more rand. When the rand strengthens, they are worth less."},
    {"type": "learn", "icon": "scales", "hdr": "KEY IDEA", "yr": 2026, "kicker": "Key idea", "exLabel": "REMEMBER",
     "head": "More growth means a bumpier ride", "sub": "Risk and return go together.",
     "ex": "Shares are a fast taxi: quicker, but bumpy. Cash is walking: slow, but steady. Spreading your money protects you.",
     "say": "Remember: the investments that can grow the most usually have the bumpiest ride. Shares are like a fast taxi. Cash is like walking. And spreading your money across different investments protects you when the future surprises you."},

    # ---------- Chapter 1: 2026 -> 2031, The AI Boom ----------
    {"type": "travel", "hdr": "CHAPTER 1 OF 2", "chapN": 1, "from": 2026, "to": 2031, "title": "The AI Boom",
     "say": "Chapter one. Let's travel five years into the future, to twenty thirty-one."},
    {"type": "news", "hdr": "CHAPTER 1 OF 2", "yr": 2031, "icon": "chip", "kicker": "Technology",
     "head": "AI now does half the world's office work", "sub": "Assistants write code, answer customers and run factories.",
     "say": "Welcome to twenty thirty-one. Artificial intelligence is everywhere. AI assistants now do half the work in offices around the world."},
    {"type": "news", "hdr": "CHAPTER 1 OF 2", "yr": 2031, "icon": "towers", "kicker": "Global markets",
     "head": "US and Asian tech giants worth more than whole countries", "sub": "The companies that build AI are growing the fastest.",
     "say": "The biggest winners are the technology giants in America and Asia. Some of them are now worth more than entire countries."},
    {"type": "news", "hdr": "CHAPTER 1 OF 2", "yr": 2031, "icon": "steady", "kicker": "South Africa",
     "head": "Local firms slower to adopt AI", "sub": "Interest rates steady. Cash and bonds pay a reliable return.",
     "say": "Here at home, South African companies are adopting AI more slowly. Interest rates are steady, so cash and bonds pay a reliable return."},
    {"type": "close", "hdr": "CHAPTER 1 OF 2", "yr": 2026, "closeKick": "CHAPTER 1 - YOUR MOVE",
     "q": "How will you split your R1000 for 2026 to 2031?", "btn": "Write down your Chapter 1 split",
     "say": "Time for your first decision. Knowing what you know about twenty thirty-one, how will you split your one thousand rand across the seven investments? Write it down, or pause the video. You'll enter it on the entry page."},

    # ---------- Chapter 2: 2031 -> 2036, The Great Slowdown ----------
    {"type": "travel", "hdr": "CHAPTER 2 OF 2", "chapN": 2, "from": 2031, "to": 2036, "title": "The Great Slowdown", "mood": "dark",
     "say": "Chapter two. Whatever you grew carries forward. Hold on tight. Let's jump five more years, to twenty thirty-six."},
    {"type": "news", "hdr": "CHAPTER 2 OF 2", "yr": 2036, "mood": "dark", "icon": "crash", "kicker": "Breaking",
     "head": "Global debt crisis shakes markets", "sub": "Governments and companies borrowed too much. Recession hits.",
     "say": "Welcome to twenty thirty-six. But the future is not always bright. Governments and companies around the world have borrowed too much. A global debt crisis is shaking the markets, and the world slips into recession."},
    {"type": "news", "hdr": "CHAPTER 2 OF 2", "yr": 2036, "mood": "dark", "icon": "shield", "kicker": "Markets",
     "head": "Investors rush to safety", "sub": "Gold, cash and government bonds are in demand. Shares and property fall.",
     "say": "Businesses are cutting jobs, and nervous investors are rushing to safety. Gold, cash and government bonds are in demand, while shares and property are falling."},
    {"type": "news", "hdr": "CHAPTER 2 OF 2", "yr": 2036, "mood": "dark", "icon": "pie", "kicker": "Investing 101",
     "head": "Diversification is your seatbelt", "sub": "Spreading your money across different assets protects you in a crash.",
     "say": "In a crisis, spreading your money across different types of assets can protect you. Diversification is your seatbelt."},
    {"type": "close", "hdr": "CHAPTER 2 OF 2", "yr": 2031, "mood": "dark", "closeKick": "CHAPTER 2 - YOUR MOVE",
     "q": "How will you split your wealth for 2031 to 2036?", "btn": "Write down your Chapter 2 split",
     "say": "Your second and final decision. How will you invest your wealth from twenty thirty-one to twenty thirty-six? Plan your split across the seven investments."},

    # ---------- Enter ----------
    {"type": "enter", "hdr": "ENTER NOW", "yr": 2036, "kick": "ENTER THE CHALLENGE", "h": "Scan to enter",
     "steps": ["Scan or screenshot this QR code", "Fill in your details", "Enter your two portfolios", "Submit - one entry per person"],
     "say": "Now it's time to enter. Scan this QR code, or take a screenshot of it, and open the entry page. Fill in your details, enter your two portfolios, and submit. Good luck, future investor. The winners will be announced after the competition closes."},
  ],
}
