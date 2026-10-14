// One small interface, two implementations:
//  - Firebase (live): anonymous sign-in for learners, Google sign-in for the presenter
//  - Demo: localStorage + BroadcastChannel, so tabs on one computer can play together
import { firebaseConfig } from "./config.js";

const FB = "https://www.gstatic.com/firebasejs/10.14.1/";

export async function createBackend() {
  if (firebaseConfig) return createFirebaseBackend();
  return createDemoBackend();
}

/* ------------------------------ Firebase ------------------------------ */
async function createFirebaseBackend() {
  const { initializeApp } = await import(FB + "firebase-app.js");
  const authMod = await import(FB + "firebase-auth.js");
  const fs = await import(FB + "firebase-firestore.js");

  const app = initializeApp(firebaseConfig);
  const auth = authMod.getAuth(app);
  const db = fs.getFirestore(app);

  const ready = new Promise((resolve) => {
    const off = authMod.onAuthStateChanged(auth, (u) => { if (u) { off(); resolve(u); } });
  });

  const stateRef = fs.doc(db, "game", "state");
  const entriesCol = (roundId) => fs.collection(db, "rounds", roundId, "entries");

  return {
    mode: "live",
    async signInLearner() {
      if (!auth.currentUser) await authMod.signInAnonymously(auth);
      return (await ready).uid;
    },
    async signInPresenter() {
      if (!auth.currentUser || auth.currentUser.isAnonymous) {
        await authMod.signInWithPopup(auth, new authMod.GoogleAuthProvider());
      }
      return auth.currentUser;
    },
    presenterUser() {
      const u = auth.currentUser;
      return u && !u.isAnonymous ? { email: u.email, name: u.displayName } : null;
    },
    onPresenterChange(cb) {
      return authMod.onAuthStateChanged(auth, (u) => cb(u && !u.isAnonymous ? { email: u.email } : null));
    },
    watchState(cb) {
      return fs.onSnapshot(stateRef, (s) => cb(s.exists() ? s.data() : null), (e) => console.error(e));
    },
    async setState(data) { await fs.setDoc(stateRef, data); },
    watchEntries(roundId, cb) {
      return fs.onSnapshot(entriesCol(roundId), (snap) => {
        cb(snap.docs.map((d) => {
          const x = d.data();
          return { uid: d.id, name: x.name, alloc: x.alloc, submittedAt: x.submittedAt?.toMillis?.() ?? Date.now() };
        }));
      }, (e) => console.error(e));
    },
    async getEntries(roundId) {
      const snap = await fs.getDocs(entriesCol(roundId));
      return snap.docs.map((d) => {
        const x = d.data();
        return { uid: d.id, name: x.name, alloc: x.alloc, submittedAt: x.submittedAt?.toMillis?.() ?? 0 };
      });
    },
    async submitEntry(roundId, uid, entry) {
      await fs.setDoc(fs.doc(db, "rounds", roundId, "entries", uid), {
        name: entry.name, alloc: entry.alloc, submittedAt: fs.serverTimestamp(),
      });
    },
    async deleteEntry(roundId, uid) { await fs.deleteDoc(fs.doc(db, "rounds", roundId, "entries", uid)); },
  };
}

/* -------------------------------- Demo -------------------------------- */
function createDemoBackend() {
  const chan = "BroadcastChannel" in window ? new BroadcastChannel("fpc-demo") : null;
  const listeners = new Set();
  const notify = () => listeners.forEach((fn) => fn());
  chan?.addEventListener("message", notify);
  window.addEventListener("storage", (e) => { if (e.key?.startsWith("fpc:")) notify(); });
  const write = (k, v) => { localStorage.setItem("fpc:" + k, JSON.stringify(v)); chan?.postMessage(k); notify(); };
  const read = (k, d) => { try { return JSON.parse(localStorage.getItem("fpc:" + k)) ?? d; } catch { return d; } };
  const sub = (fn) => { listeners.add(fn); fn(); return () => listeners.delete(fn); };

  let uid = sessionStorage.getItem("fpc:uid");
  if (!uid) { uid = "demo-" + Math.random().toString(36).slice(2, 10); sessionStorage.setItem("fpc:uid", uid); }

  return {
    mode: "demo",
    async signInLearner() { return uid; },
    async signInPresenter() { return { email: "demo" }; },
    presenterUser() { return { email: "demo" }; },
    onPresenterChange(cb) { cb({ email: "demo" }); return () => {}; },
    watchState(cb) {
      let last;
      return sub(() => { const s = read("state", null); const j = JSON.stringify(s); if (j !== last) { last = j; cb(s); } });
    },
    async setState(data) { write("state", data); },
    watchEntries(roundId, cb) {
      let last;
      return sub(() => {
        const m = read("entries:" + roundId, {});
        const j = JSON.stringify(m);
        if (j !== last) { last = j; cb(Object.entries(m).map(([k, v]) => ({ uid: k, ...v }))); }
      });
    },
    async getEntries(roundId) {
      return Object.entries(read("entries:" + roundId, {})).map(([k, v]) => ({ uid: k, ...v }));
    },
    async submitEntry(roundId, id, entry) {
      const state = read("state", null);
      if (!state || state.roundId !== roundId || state.phase !== "open") throw new Error("Submissions are closed");
      const m = read("entries:" + roundId, {});
      m[id] = { name: entry.name, alloc: entry.alloc, submittedAt: Date.now() };
      write("entries:" + roundId, m);
    },
    async deleteEntry(roundId, id) {
      const m = read("entries:" + roundId, {});
      delete m[id];
      write("entries:" + roundId, m);
    },
  };
}
