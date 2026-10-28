import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const firebaseConfigured = Boolean(cfg.apiKey && cfg.projectId)
const auth = firebaseConfigured ? getAuth(initializeApp(cfg)) : null

// Opens the Google popup and returns a Firebase ID token for our backend to verify
export const googleSignInToken = async () => {
  if (!auth) throw new Error('Firebase is not configured. Fill in VITE_FIREBASE_* in frontend/.env')
  const result = await signInWithPopup(auth, new GoogleAuthProvider())
  return result.user.getIdToken()
}
