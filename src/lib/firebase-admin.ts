import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { applicationDefault } from 'firebase-admin/app';

function getFirebaseAdmin() {
  if (!admin.apps.length) {
    try {
      // This will use the GOOGLE_APPLICATION_CREDENTIALS environment variable
      // automatically provided by App Hosting.
      admin.initializeApp({
        credential: applicationDefault(),
      });
    } catch (e) {
      console.error('Firebase Admin Initialization Error:', e);
    }
  }
  return { auth: admin.auth(), db: getFirestore() };
}

export const { auth, db } = getFirebaseAdmin();
