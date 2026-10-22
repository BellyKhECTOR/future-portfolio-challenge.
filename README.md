# Future Portfolio Challenge - setup guide

A live classroom game: a scenario video plays, a QR code appears, learners build a R1000 portfolio on their phones (no login), and the top 10 appear on a leaderboard.

## What's in the folder

| File | What it is |
|---|---|
| `index.html` | **Presenter screen** for the projector: scenarios, video, QR code, timer, leaderboard |
| `play.html` | **Learner page** the QR code opens on phones |
| `js/scenarios.js` | Asset classes, the 4 scenarios and their returns (edit here or in Settings) |
| `js/config.js` | Where you paste your Firebase settings |
| `videos/` | Put your scenario videos here |
| `firestore.rules` | Database security rules |

## 1. Try it first in demo mode (5 minutes, no setup)

Demo mode runs on one laptop with no database, so you can rehearse the flow.

1. Open a terminal in this folder and run `python -m http.server 8000`
2. Open `http://localhost:8000` in Edge - this is the presenter screen
3. Open `http://localhost:8000/play.html` in two or three more tabs - these are "learners"
4. Click a scenario, skip the video, submit portfolios in the learner tabs, close submissions and reveal

## 2. Go live (GitHub Pages for the site, Firebase for the database)

GitHub Pages hosts the two pages for free. Firebase (free Spark plan) stores the submissions.

**Firebase - the database**
1. Go to https://console.firebase.google.com and create a project (e.g. `future-portfolio`). Google Analytics is not needed.
2. **Build > Authentication > Get started**, then enable **Anonymous** (learners) and **Google** (you, the presenter).
3. **Authentication > Settings > Authorised domains > Add domain**: add `<your-github-username>.github.io`
4. **Build > Firestore Database > Create database**, location `africa-south1 (Johannesburg)`, production mode.
5. **Firestore Database > Rules**: paste the contents of `firestore.rules`, replace `PRESENTER_EMAIL@example.com` with your Google account, and press **Publish**.
6. **Project settings > General > Your apps > Web (</>)**: register an app and copy the `firebaseConfig` object into `js/config.js` (replace `null`). These keys are safe to be public - the rules protect the data.

**GitHub Pages - the site**
1. In the repository, go to **Settings > Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
3. After a minute the game is live at `https://<your-github-username>.github.io/<repo-name>/`. The QR code points to `.../play.html` automatically.

GitHub limits files to 100 MB, so large videos are best played from your laptop with **Choose video from computer**.

## 3. Add your videos

Either:
- Name your MP4 files `ai-boom.mp4`, `green-shift.mp4`, `global-shock.mp4`, `sa-rising.mp4`, put them in `videos/` and push them to GitHub, or
- On the night, click **Choose video from computer** when a round starts. Nothing is uploaded; it plays from your laptop.

You can change years, titles, taglines, video names, lessons and returns in **Settings** on the presenter screen (saved on that laptop) or permanently in `js/scenarios.js`.

## Running a session

The game is one journey with four chapters: **2026 -> 2031 -> 2046 -> 2050 -> 2055**. Every learner starts with R1000, and whatever they grow carries into the next chapter. The richest portfolio in 2055 wins.

1. Open the site on the projector laptop in Edge, sign in with Google, press **Full screen**. Press **New game** to start fresh.
2. Press **Step 1: Watch Investing 101** - a 4-minute narrated lesson that explains the 7 investments with everyday South African examples (shares in Shoprite and MTN, lending your cousin R100, rent from the mall, bread prices and inflation), plus risk, diversification, the rand and compounding. You can pause it to ask questions. Learners' phones show "Meet the 7 investments" while they wait, and every investment on the portfolio builder has a **What is this?** explanation.
3. Press **Step 2: Start the journey - 2031**. The video plays full screen.
4. When the video ends (or you press **Skip to QR code**), the QR appears and submissions open. Optionally start a timer.
5. Learners scan, enter a name and split their wealth to exactly 100%. From chapter 2 onwards their phone shows what their portfolio is worth and pre-fills their last mix.
6. Press **Close submissions**, then **Reveal results**. The chapter's returns appear and the top 10 by **total wealth** animate in, with arrows showing who moved up or down. Each phone shows that learner's wealth, change this chapter, total since 2026 and rank.
7. Press **Continue to 2046** and repeat.
8. After the 2055 chapter, **Reveal results** starts the **winners ceremony**: a 5-second countdown, then third place, the runner-up and the winner on a podium (with confetti and sound), then a chart of how the top three's wealth grew from 2026 to 2055 against the class average. Phones show "The winners are being revealed!" until the ceremony ends, then each learner's final result. Use **Full leaderboard** (or Esc) to see the top 10, and **Winners ceremony** on the results screen to replay it. Turn the laptop sound on for the countdown ticks and fanfare.

To start over with a new class, open **Settings** and press **Reset game**. It permanently deletes every learner's portfolios and all results and takes the timeline back to 2026 with everyone on R1000. (**Reset to defaults** in the same panel only resets the chapter wording and returns.)

Rules of the journey:
- A learner who doesn't submit in a chapter keeps their previous mix.
- A learner who joins late starts with R1000 in the chapter they join.
- Hover over a leaderboard row and press x to remove a player from the whole game.
- **Timeline** goes back to the overview at any point; **View standings** shows the latest leaderboard.

## Design notes

- Returns stay on the presenter laptop until the reveal, so learners can't see them while choosing. There is deliberately no live leaderboard while submissions are open, otherwise everyone would copy the leader.
- Ties are broken by whoever submitted first.
- The database rules only accept allocations of whole percentages that add up to exactly 100, only for the current round, and only while submissions are open.
- Free-tier limits (50 000 reads and 20 000 writes a day) comfortably cover several classes of 40 learners.
- Learners need mobile data or school Wi-Fi. The page is small (under 100 KB plus Firebase).


## Online competition (video + entry page)

A shareable version for the internet: one video, entries collected privately, results announced later.

| File | What it is |
|---|---|
| `videos/competition.mp4` | The competition video (about 4 min 20 s, 1080p, 52 MB). Rules, the 7 investments explained with everyday examples, a key idea on risk, Chapter 1 *The AI Boom* (2026-2031), Chapter 2 *The Great Slowdown* (2031-2036), then a full-screen QR code. A small QR code stays in the corner throughout. |
| `enter.html` | The entry page the QR code opens: name, email, cellphone, under-18 question (with parent/guardian consent), POPIA consent, then the R1000 split for each chapter. One entry per device; entries can't be changed. No results are shown. |
| `results.html` | The private organiser page (presenter Google account only): open/close entries, enter the secret returns, see the ranking, flag duplicates, delete entries, download a CSV. |

How to run it:
1. Publish the Firestore rules in `firestore.rules` (they include the competition rules).
2. Open `results.html`, sign in, enter the two chapters' returns and press **Save returns**. They are stored privately in the database - never in the public code.
3. Tick **Accepting entries** and press **Save**. Share the video.
4. When the competition ends, untick and **Save** to close entries, then **Download CSV**. Duplicates (same email or phone) are flagged; only the earliest counts.

Scoring: wealth in 2031 = R1000 x (sum of chapter 1 weights x (1 + return)); wealth in 2036 = wealth in 2031 x (sum of chapter 2 weights x (1 + return)). Highest 2036 value wins; ties go to the earlier entry.
