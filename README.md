# Future Portfolio Challenge - setup guide

A live classroom game: a scenario video plays, a QR code appears, learners build a R10 million portfolio on their phones (no login), and the top 10 appear on a leaderboard.

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

You can change titles, taglines, video names, lessons and returns in **Settings** on the presenter screen (saved on that laptop) or permanently in `js/scenarios.js`.

## Running a session

1. Open the site on the projector laptop in Edge, sign in with Google, press **Full screen**.
2. Click a scenario. The video plays full screen; the round state tells phones to wait.
3. When the video ends (or you press **Skip to QR code**), the QR appears and submissions open. Optionally start a 2, 3 or 5 minute timer.
4. Learners scan, enter a name, split R10m to exactly 100% and submit. Names pop up on screen as they arrive. They can change their portfolio until you close submissions.
5. Press **Close submissions**, then **Reveal results**. The scenario's returns appear, the top 10 animate in from 10th to 1st, and each phone shows that learner's own result and rank.
6. Hover over a leaderboard row and press x to remove a rude name.
7. **Next scenario** returns to the scenario list for another round.

## Design notes

- Returns stay on the presenter laptop until the reveal, so learners can't see them while choosing. There is deliberately no live leaderboard while submissions are open, otherwise everyone would copy the leader.
- Ties are broken by whoever submitted first.
- The database rules only accept allocations of whole percentages that add up to exactly 100, only for the current round, and only while submissions are open.
- Free-tier limits (50 000 reads and 20 000 writes a day) comfortably cover several classes of 40 learners.
- Learners need mobile data or school Wi-Fi. The page is small (under 100 KB plus Firebase).
