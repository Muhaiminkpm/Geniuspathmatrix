
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// This function ensures the Firebase Admin app is initialized only once.
function getAdminApp() {
  if (admin.apps.length > 0) {
    return admin.apps[0] as admin.app.App;
  }

  // In a real production environment, you would use a service account.
  // For local development and Firebase emulators, this basic initialization is sufficient.
  const app = admin.initializeApp();
  return app;
}

const app = getAdminApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
