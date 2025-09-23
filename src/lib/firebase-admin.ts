import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { applicationDefault } from 'firebase-admin/app';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: applicationDefault(),
  });
}

const auth = admin.auth();
const db = getFirestore();

export { auth, db };
