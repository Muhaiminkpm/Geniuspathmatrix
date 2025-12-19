
import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";

let adminApp: App;

// This prevents re-initializing the app on every hot-reload in development
if (!getApps().length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    // Handle various formats of private key from environment variables
    let privateKey: string | undefined = process.env.FIREBASE_PRIVATE_KEY;
    if (privateKey) {
      // If the key is JSON-escaped (wrapped in quotes), parse it
      if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        try {
          privateKey = JSON.parse(privateKey) as string;
        } catch (e) {
          // Not valid JSON, continue with other replacements
        }
      }
      // Replace escaped newlines with actual newlines
      privateKey = privateKey!.replace(/\\n/g, '\n');
    }

    if (!projectId) {
      throw new Error('Missing FIREBASE_PROJECT_ID environment variable');
    }
    if (!clientEmail) {
      throw new Error('Missing FIREBASE_CLIENT_EMAIL environment variable');
    }
    if (!privateKey) {
      throw new Error('Missing FIREBASE_PRIVATE_KEY environment variable');
    }

    adminApp = initializeApp({
      credential: cert({
        project_id: projectId,
        client_email: clientEmail,
        private_key: privateKey,
      } as any),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error:', error.message);
    throw error;
  }
} else {
  adminApp = getApps()[0];
}


const adminDb: Firestore = getFirestore(adminApp);
const adminAuth: Auth = getAuth(adminApp);

export { adminDb, adminAuth };
