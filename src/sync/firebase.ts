import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut as fbSignOut,
  type Auth,
  type User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  type Firestore,
} from 'firebase/firestore';
import type { SyncSnapshot } from './sync';

// ── Firebase 설정 ──────────────────────────────────────────────
// Firebase Console → 프로젝트 설정 → 내 앱 → 웹앱 설정값 입력
const firebaseConfig = {
  apiKey: 'AIzaSyDFt1VlcQDQtgcxDBw81x5CcNvqp77ZG0I',
  authDomain: 'deck-of-dungeon.firebaseapp.com',
  projectId: 'deck-of-dungeon',
  storageBucket: 'deck-of-dungeon.firebasestorage.app',
  messagingSenderId: '224075374203',
  appId: '1:224075374203:web:432633ea22281345ab0cde',
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let currentUser: User | null = null;
let authReadyResolve: (() => void) | null = null;
const authReady = new Promise<void>(r => { authReadyResolve = r; });

export function isFirebaseConfigured(): boolean {
  return firebaseConfig.apiKey !== '' && firebaseConfig.projectId !== '';
}

function ensureInit(): { auth: Auth; db: Firestore } {
  if (!app) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    onAuthStateChanged(auth, (user) => {
      currentUser = user;
      if (authReadyResolve) { authReadyResolve(); authReadyResolve = null; }
      window.dispatchEvent(new CustomEvent('dod:auth-changed'));
    });
  }
  return { auth: auth!, db: db! };
}

export function getFirebaseUser(): User | null {
  return currentUser;
}

export function isFirebaseLinked(): boolean {
  return currentUser !== null;
}

export async function waitForAuth(): Promise<void> {
  if (!isFirebaseConfigured()) return;
  ensureInit();
  await authReady;
}

export async function googleSignIn(): Promise<User> {
  const { auth } = ensureInit();
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function googleSignOut(): Promise<void> {
  const { auth } = ensureInit();
  await fbSignOut(auth);
}

// ── Firestore 저장/불러오기 ────────────────────────────────────
export async function firebasePull(): Promise<SyncSnapshot | null> {
  if (!currentUser) return null;
  const { db } = ensureInit();
  const snap = await getDoc(doc(db, 'saves', currentUser.uid));
  if (!snap.exists()) return null;
  return snap.data() as SyncSnapshot;
}

export async function firebasePush(data: SyncSnapshot): Promise<void> {
  if (!currentUser) return;
  const { db } = ensureInit();
  await setDoc(doc(db, 'saves', currentUser.uid), data);
}
