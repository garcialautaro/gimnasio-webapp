import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirebaseAuth } from './firebase';

export async function signInWithEmail(email: string, password: string) {
  const firebaseAuth = getFirebaseAuth();
  if (!firebaseAuth) {
    throw new Error('Firebase auth is not available on the server.');
  }
  const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
  const idToken = await credential.user.getIdToken();
  return { idToken, user: credential.user };
}

export async function signOutUser() {
  const firebaseAuth = getFirebaseAuth();
  if (!firebaseAuth) {
    throw new Error('Firebase auth is not available on the server.');
  }
  return signOut(firebaseAuth);
}
