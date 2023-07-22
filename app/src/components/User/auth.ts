import { initializeApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDKFVsyh9QQvO0Mt2QkNcKn1fOgZWpEgvY',
  authDomain: 'task-fast-0928.firebaseapp.com',
  projectId: 'task-fast-0928',
  storageBucket: 'task-fast-0928.appspot.com',
  messagingSenderId: '410354198723',
  appId: '1:410354198723:web:5406de2ac09815b5beda76',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export const loginWithGoogle = async () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const token = credential?.accessToken
      const user = result.user
      console.log('success')
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      const email = error.customData.email
      const credential = GoogleAuthProvider.credentialFromError(error)
      console.log('error')
    })
}

const monitorAuthState = async () => {
  onAuthStateChanged(auth, (user) => {
    if (process.env.NODE_ENV !== 'development') return
    if (user) {
      console.log('login user: ', user)
    } else {
      console.log('No one login now')
    }
  })
}

monitorAuthState()

export const logout = async () => {
  await signOut(auth)
}