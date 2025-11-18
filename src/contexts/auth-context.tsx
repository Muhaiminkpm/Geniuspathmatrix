
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase/firebase-config';
import { LoadingSpinner } from '@/components/loading-spinner';
import { createUserDocument } from '@/lib/actions';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  signup: (authEmail: string, pass: string, details: { username: string, phone: string, email: string | null }) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (email: string, pass: string) => {
    const auth = getFirebaseAuth();
    return signInWithEmailAndPassword(auth, email, pass);
  };
  
  const signup = async (authEmail: string, pass: string, details: { username: string, phone: string, email: string | null }) => {
    const auth = getFirebaseAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, authEmail, pass);
    const user = userCredential.user;
    
    // Create user document in Firestore via a server action
    if (user) {
      const result = await createUserDocument({
        uid: user.uid, 
        email: authEmail, // Store the email used for auth (real or dummy)
        username: details.username,
        phone: details.phone
      });
      // If the username was taken, the server action will throw.
      // We should delete the just-created Firebase auth user to allow the user to try again.
      if (!result.success) {
          await user.delete();
          throw new Error(result.error);
      }
    }
    
    return userCredential;
  }

  const logout = () => {
    const auth = getFirebaseAuth();
    return signOut(auth);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
         <div className="flex h-screen items-center justify-center">
            <LoadingSpinner className="h-12 w-12" />
        </div>
      ) : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
