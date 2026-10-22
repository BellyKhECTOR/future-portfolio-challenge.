// Data layer for the online competition. Firebase when configured, otherwise a
// localStorage demo so the pages can be tried on one computer.
//   competition/config  { open }                - public read, admin write
//   competition/secret  { r1: {...}, r2: {...} } - admin only (the returns)
//   compEntries/{uid}   one entry per signed-in device, admin read
import { firebaseConfig } from "./config.js";

const FB = "https://www.gstatic.com/firebasejs/10.14.1/";

export async function createCompBackend() {
  return firebaseConfig ? firebaseBackend() : demoBackend();
}

async function firebaseBackend() {
  const { initializeApp } = await import(FB + "firebase-app.js");
  const A = await import(FB + "firebase-auth.js");
  const F = await import(FB + "firebase-firestore.js");
  const app = initializeApp(firebaseConfig);
  const auth = A.getAuth(app), db = F.getFirestore(app);
  const ready = new Promise((res) => { const off = A.onAuthStateChanged(auth, (u) => { if (u) { off(); res(u); } }); });
  const cfgRef = F.doc(db, "competition", "config"), secRef = F.doc(db, "competition", "secret");
  const toMs = (v) => (v && typeof v.toMillis === "function" ? v.toMillis() : v ?? null);

  return {
    mode: "live",
    async signInEntrant() { if (!auth.currentUser) await A.signInAnonymously(auth); return (await ready).uid; },
    async getConfig() { const s = await F.getDoc(cfgRef); if (!s.exists()) return null; return { open: !!s.data().open }; },
    async getMyEntry(uid) { try { const s = await F.getDoc(F.doc(db, "compEntries", uid)); return s.exists() ? s.data() : null; } catch { return null; } },
    async submitEntry(uid, entry) { await F.setDoc(F.doc(db, "compEntries", uid), { ...entry, submittedAt: F.serverTimestamp() }); },
    // admin
    async signInAdmin() { if (!auth.currentUser || auth.currentUser.isAnonymous) await A.signInWithPopup(auth, new A.GoogleAuthProvider()); return auth.currentUser; },
    onAdminChange(cb) { return A.onAuthStateChanged(auth, (u) => cb(u && !u.isAnonymous ? { email: u.email } : null)); },
    async setConfig({ open }) { await F.setDoc(cfgRef, { open: !!open }); },
    async getSecret() { const s = await F.getDoc(secRef); return s.exists() ? s.data() : null; },
    async setSecret(sec) { await F.setDoc(secRef, sec); },
    watchEntries(cb, err) {
      return F.onSnapshot(F.collection(db, "compEntries"), (snap) => cb(snap.docs.map((d) => ({ uid: d.id, ...d.data(), submittedAt: toMs(d.data().submittedAt) }))), err);
    },
    async deleteEntry(uid) { await F.deleteDoc(F.doc(db, "compEntries", uid)); },
  };
}

function demoBackend() {
  const K = "fpcComp:";
  const read = (k, d) => { try { return JSON.parse(localStorage.getItem(K + k)) ?? d; } catch { return d; } };
  const write = (k, v) => { localStorage.setItem(K + k, JSON.stringify(v)); listeners.forEach((f) => f()); };
  const listeners = new Set();
  window.addEventListener("storage", (e) => { if (e.key?.startsWith(K)) listeners.forEach((f) => f()); });
  let uid = sessionStorage.getItem(K + "uid");
  if (!uid) { uid = "demo-" + Math.random().toString(36).slice(2, 10); sessionStorage.setItem(K + "uid", uid); }
  return {
    mode: "demo",
    async signInEntrant() { return uid; },
    async getConfig() { return read("config", null); },
    async getMyEntry(id) { return read("entries", {})[id] ?? null; },
    async submitEntry(id, entry) {
      const c = read("config", null);
      if (!c || !c.open) throw new Error("closed");
      const all = read("entries", {}); if (all[id]) throw new Error("exists");
      all[id] = { ...entry, submittedAt: Date.now() }; write("entries", all);
    },
    async signInAdmin() { return { email: "demo" }; },
    onAdminChange(cb) { cb({ email: "demo" }); return () => {}; },
    async setConfig(c) { write("config", c); },
    async getSecret() { return read("secret", null); },
    async setSecret(s) { write("secret", s); },
    watchEntries(cb) { const f = () => cb(Object.entries(read("entries", {})).map(([k, v]) => ({ uid: k, ...v }))); listeners.add(f); f(); return () => listeners.delete(f); },
    async deleteEntry(id) { const all = read("entries", {}); delete all[id]; write("entries", all); },
  };
}
