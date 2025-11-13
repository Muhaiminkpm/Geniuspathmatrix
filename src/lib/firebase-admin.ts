import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// This function ensures the Firebase Admin app is initialized only once.
function getAdminApp() {
    if (admin.apps.length > 0) {
        return admin.app();
    }

    // Check if the required environment variables are available.
    // In Firebase App Hosting, these are provided automatically.
    // Locally, you need to set GOOGLE_APPLICATION_CREDENTIALS.
    if (process.env.GCLOUD_PROJECT) {
      return admin.initializeApp();
    }

    // Fallback for local development if GOOGLE_APPLICATION_CREDENTIALS is not set
    // This part of the code may not be reached in a deployed environment but is useful for local setup.
    try {
        const serviceAccount = require('../../service-account.json');
        return admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } catch (e) {
        console.error('Firebase Admin Initialization Error:', e);
        console.error('Could not find service-account.json. Please ensure it is present in the root directory for local development, or that GOOGLE_APPLICATION_CREDENTIALS is set.');
        throw new Error('Failed to initialize Firebase Admin SDK.');
    }
}

const app = getAdminApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
