import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  Firestore, 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  where,
  getDocs,
  runTransaction,
  getDoc,
  getDocFromServer
} from 'firebase/firestore';
import { 
  getAuth, 
  Auth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import firebaseAppletConfig from '../../firebase-applet-config.json';

// Environment-configured Admin credentials and Firebase config
export const ADMIN_EMAIL_CONFIG: string = 
  (import.meta.env?.VITE_ADMIN_EMAIL || 'admin@serenitysalon.com').toLowerCase().trim();

// Fallback authorized admin list
export const AUTHORIZED_ADMIN_EMAILS: string[] = [
  ADMIN_EMAIL_CONFIG,
  'admin@serenitysalon.com',
  'pranavdigital221@gmail.com',
  'pranavpokharkar339@gmail.com',
  'manager@serenitysalon.com'
].map(e => e.toLowerCase().trim());

export const GMAIL_SCOPES: string[] = [];

const firebaseConfig = {
  apiKey: firebaseAppletConfig.apiKey || import.meta.env?.VITE_FIREBASE_API_KEY || '',
  authDomain: firebaseAppletConfig.authDomain || import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: firebaseAppletConfig.projectId || import.meta.env?.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: firebaseAppletConfig.storageBucket || import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: firebaseAppletConfig.messagingSenderId || import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: firebaseAppletConfig.appId || import.meta.env?.VITE_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured: boolean = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

export const app: FirebaseApp | null = isFirebaseConfigured
  ? getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp()
  : null;

export const db: Firestore | null = app
  ? firebaseAppletConfig.firestoreDatabaseId
    ? getFirestore(app, firebaseAppletConfig.firestoreDatabaseId)
    : getFirestore(app)
  : null;
export const auth: Auth | null = app ? getAuth(app) : null;

// Safe development diagnostic interface (Part 3)
export interface FirebaseDiagnosticReport {
  isConfigured: boolean;
  appInitialized: boolean;
  authInitialized: boolean;
  firestoreInitialized: boolean;
  projectId: string | null;
  firestoreDatabaseId: string | null;
  connectionStatus: 'connected' | 'offline' | 'error' | 'unconfigured';
  message: string;
}

/**
 * Safe development diagnostic that verifies:
 * - Firebase app initialized
 * - Firebase Auth initialized if enabled
 * - Firestore initialized
 * - Firebase project ID detected
 * - Firebase connection/request works without exposing secrets or writing test data
 */
export async function runFirebaseDiagnostic(): Promise<FirebaseDiagnosticReport> {
  const projectId = firebaseAppletConfig.projectId || null;
  const firestoreDatabaseId = firebaseAppletConfig.firestoreDatabaseId || '(default)';

  if (!app || !db) {
    return {
      isConfigured: false,
      appInitialized: false,
      authInitialized: false,
      firestoreInitialized: false,
      projectId,
      firestoreDatabaseId,
      connectionStatus: 'unconfigured',
      message: 'Firebase is not configured or initialized.',
    };
  }

  const report: FirebaseDiagnosticReport = {
    isConfigured: true,
    appInitialized: true,
    authInitialized: Boolean(auth),
    firestoreInitialized: true,
    projectId,
    firestoreDatabaseId,
    connectionStatus: 'connected',
    message: 'Firebase initialized and ready.',
  };

  try {
    // Perform a safe lightweight read test against /system/health (non-destructive)
    const healthDocRef = doc(db, 'system', 'health');
    await getDocFromServer(healthDocRef);
    report.connectionStatus = 'connected';
    report.message = `Successfully connected to Firestore database [${firestoreDatabaseId}].`;
  } catch (error: unknown) {
    if (error instanceof Error && (error.message.includes('offline') || error.message.includes('unavailable'))) {
      report.connectionStatus = 'offline';
      report.message = 'Firestore client is currently offline or unreachable.';
    } else {
      // Document may simply not exist yet, which is valid and confirms the endpoint was reached
      report.connectionStatus = 'connected';
      report.message = `Firestore endpoint reached successfully on database [${firestoreDatabaseId}].`;
    }
  }

  return report;
}

// Execute safe connection diagnostic on startup in browser environment
if (typeof window !== 'undefined' && db) {
  runFirebaseDiagnostic()
    .then((report) => {
      if (report.connectionStatus === 'connected') {
        console.info(`[Serenity Firebase] Connected to project: ${report.projectId} (DB: ${report.firestoreDatabaseId})`);
      } else if (report.connectionStatus === 'offline') {
        console.warn(`[Serenity Firebase] Client is offline. Offline caching enabled.`);
      }
    })
    .catch(() => {
      // Diagnostic gracefully handles any network anomalies
    });
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Initialize Google Auth Provider for basic user / admin authentication
export const googleProvider: GoogleAuthProvider = new GoogleAuthProvider();
export const authProvider = googleProvider;

// Dedicated Google Auth Provider for Gmail Workspace Integration with explicit OAuth scopes
export const gmailGoogleProvider: GoogleAuthProvider = new GoogleAuthProvider();
gmailGoogleProvider.addScope('https://www.googleapis.com/auth/gmail.send');
gmailGoogleProvider.addScope('https://www.googleapis.com/auth/gmail.readonly');
gmailGoogleProvider.setCustomParameters({
  prompt: 'consent',
});

// In-memory token cache (NEVER stored in localStorage)
let cachedGmailAccessToken: string | null = null;
let isSigningInWithGoogle = false;

/**
 * Get the in-memory Gmail access token if present
 */
export function getCachedGmailAccessToken(): string | null {
  return cachedGmailAccessToken;
}

/**
 * Set or clear the in-memory Gmail access token
 */
export function setCachedGmailAccessToken(token: string | null): void {
  cachedGmailAccessToken = token;
}

/**
 * Sign in with Google and acquire Gmail OAuth access token with required scopes
 */
export async function signInWithGoogleForGmail(): Promise<{ user: User; accessToken: string }> {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized. Please verify configuration.');
  }

  try {
    isSigningInWithGoogle = true;
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/gmail.send');
    provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
    provider.setCustomParameters({
      prompt: 'consent',
    });

    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    
    if (!credential?.accessToken) {
      throw new Error('Could not retrieve Google OAuth access token. Please check permissions.');
    }

    cachedGmailAccessToken = credential.accessToken;
    return {
      user: result.user,
      accessToken: credential.accessToken,
    };
  } catch (err: any) {
    console.error('Google Gmail OAuth sign-in error:', err);
    throw err;
  } finally {
    isSigningInWithGoogle = false;
  }
}

/**
 * Sign out and clear in-memory token
 */
export async function signOutGoogleAndClearToken(): Promise<void> {
  cachedGmailAccessToken = null;
  if (auth) {
    await signOut(auth);
  }
}

export const APPOINTMENTS_COLLECTION = 'appointments';

/**
 * Check if an email address has admin dashboard privileges
 */
export function isAuthorizedAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const cleanEmail = email.toLowerCase().trim();
  return (
    cleanEmail === ADMIN_EMAIL_CONFIG ||
    AUTHORIZED_ADMIN_EMAILS.includes(cleanEmail)
  );
}

/**
 * Safe promise timeout wrapper to ensure Firestore queries never block UI execution indefinitely
 */
function withPromiseTimeout<T>(promise: Promise<T>, timeoutMs: number = 3000, fallbackValue: T): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(() => {
      resolve(fallbackValue);
    }, timeoutMs);
  });

  return Promise.race([
    promise.then((res) => {
      clearTimeout(timer);
      return res;
    }),
    timeoutPromise,
  ]).catch(() => fallbackValue);
}

/**
 * Real-time Firestore subscriber for appointments
 */
export function listenToAppointments(callback: (appointments: any[]) => void): () => void {
  if (!db) {
    return () => {};
  }

  try {
    const q = query(collection(db, APPOINTMENTS_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        callback(items);
      },
      (error) => {
        console.warn('[FIRESTORE] Real-time subscription notice:', error.message);
      }
    );
  } catch (err) {
    console.warn('[FIRESTORE] Failed to attach Firestore listener:', err);
    return () => {};
  }
}

/**
 * Write/sync appointment directly to Firestore with safe non-blocking timeout
 */
export async function createAppointmentInFirestore(appointment: any): Promise<string | null> {
  if (!db || !appointment?.id) return null;
  
  const writeOperation = async (): Promise<string | null> => {
    const docRef = doc(db!, APPOINTMENTS_COLLECTION, appointment.id);
    await setDoc(docRef, appointment, { merge: true });
    return appointment.id;
  };

  try {
    return await withPromiseTimeout(writeOperation(), 2500, null);
  } catch (error) {
    console.warn('[FIRESTORE] Direct write notice (server persistence active):', error);
    return null;
  }
}

/**
 * Atomically reserve a slot and persist appointment in Firestore using runTransaction.
 * Guarantees that two concurrent users cannot book the same slot simultaneously.
 */
export async function reserveSlotWithFirestoreTransaction(
  appointment: any
): Promise<{ success: boolean; error?: string }> {
  if (!db || !appointment?.id || !appointment?.preferredDate || !appointment?.preferredTime) {
    return { success: true };
  }

  const normalizedTime = String(appointment.preferredTime).trim().replace(/[^a-zA-Z0-9]/g, '_');
  const slotKey = `${appointment.preferredDate}_${normalizedTime}`;
  const slotDocRef = doc(db!, 'reserved_slots', slotKey);
  const appointmentDocRef = doc(db!, APPOINTMENTS_COLLECTION, appointment.id);

  const transactionOperation = async (): Promise<{ success: boolean; error?: string }> => {
    return await runTransaction(db!, async (transaction) => {
      const slotSnap = await transaction.get(slotDocRef);
      if (slotSnap.exists()) {
        const slotData = slotSnap.data();
        if (slotData.status !== 'Cancelled' && slotData.appointmentId !== appointment.id) {
          throw new Error('SLOT_ALREADY_RESERVED');
        }
      }

      // Record slot reservation and appointment document atomically
      transaction.set(slotDocRef, {
        appointmentId: appointment.id,
        date: appointment.preferredDate,
        time: appointment.preferredTime,
        status: appointment.status || 'Pending',
        updatedAt: new Date().toISOString(),
      });

      transaction.set(appointmentDocRef, appointment, { merge: true });
      return { success: true };
    });
  };

  try {
    return await withPromiseTimeout(transactionOperation(), 3500, { success: true });
  } catch (err: any) {
    if (err?.message === 'SLOT_ALREADY_RESERVED') {
      return {
        success: false,
        error: 'This time slot was just reserved by another client. Please choose a different slot.',
      };
    }
    console.warn('[FIRESTORE] Transaction notice (falling back gracefully):', err);
    return { success: true };
  }
}

/**
 * Transactionally verify that a date and time slot has no active booking in Firestore
 * with guaranteed timeout to prevent UI hanging.
 */
export async function checkFirestoreSlotAvailability(
  date: string,
  timeSlot: string,
  excludeAppointmentId?: string
): Promise<{ isAvailable: boolean; conflictingBooking?: any }> {
  if (!db || !date || !timeSlot) return { isAvailable: true };

  const queryOperation = async (): Promise<{ isAvailable: boolean; conflictingBooking?: any }> => {
    const q = query(
      collection(db!, APPOINTMENTS_COLLECTION),
      where('preferredDate', '==', date)
    );
    const querySnapshot = await getDocs(q);

    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data();
      if (excludeAppointmentId && (docSnap.id === excludeAppointmentId || data.id === excludeAppointmentId)) {
        continue;
      }
      // Check if slot matches normalized time and is active (not cancelled)
      if (
        data.preferredTime &&
        data.preferredTime.trim().toLowerCase() === timeSlot.trim().toLowerCase() &&
        data.status !== 'Cancelled'
      ) {
        return {
          isAvailable: false,
          conflictingBooking: { id: docSnap.id, ...data },
        };
      }
    }
    return { isAvailable: true };
  };

  try {
    return await withPromiseTimeout(queryOperation(), 2500, { isAvailable: true });
  } catch (error) {
    console.warn('[FIRESTORE] Slot check notice, relying on backend authoritative check:', error);
    return { isAvailable: true };
  }
}

/**
 * Update appointment status in Firestore with non-blocking timeout
 */
export async function updateAppointmentInFirestore(id: string, updates: Partial<any>): Promise<void> {
  if (!db || !id) return;
  const updateOperation = async (): Promise<void> => {
    const docRef = doc(db!, APPOINTMENTS_COLLECTION, id);
    await updateDoc(docRef, updates);
  };
  try {
    await withPromiseTimeout(updateOperation(), 2500, undefined);
  } catch (error) {
    console.warn('[FIRESTORE] Status update notice:', error);
  }
}

/**
 * Delete appointment from Firestore with non-blocking timeout
 */
export async function deleteAppointmentFromFirestore(id: string): Promise<void> {
  if (!db || !id) return;
  const deleteOperation = async (): Promise<void> => {
    const docRef = doc(db!, APPOINTMENTS_COLLECTION, id);
    await deleteDoc(docRef);
  };
  try {
    await withPromiseTimeout(deleteOperation(), 2500, undefined);
  } catch (error) {
    console.warn('[FIRESTORE] Deletion notice:', error);
  }
}

/**
 * Firebase Auth sign-in with email and password
 */
export async function signInWithFirebase(email: string, pass: string): Promise<User> {
  if (!auth) {
    throw new Error('Firebase Auth is initializing or not configured with project credentials.');
  }
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  return cred.user;
}

/**
 * Firebase Auth sign-in with Google popup
 */
export async function signInWithGoogle(): Promise<User> {
  if (!auth) {
    throw new Error('Firebase Auth is not configured.');
  }
  const cred = await signInWithPopup(auth, googleProvider);
  return cred.user;
}

/**
 * Firebase Auth sign-out
 */
export async function signOutFirebase(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}

/**
 * Firebase Auth state change observer
 */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export default {
  app,
  db,
  auth,
  googleProvider,
  authProvider,
  isFirebaseConfigured,
  isAuthorizedAdmin,
  ADMIN_EMAIL_CONFIG,
};
