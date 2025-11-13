import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// This function ensures the Firebase Admin app is initialized only once.
function getAdminApp() {
    if (admin.apps.length > 0) {
        return admin.app();
    }
    
    return admin.initializeApp();
}

const app = getAdminApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
