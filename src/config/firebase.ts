import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAMAWhWIwdawJ00EsVUXgxEObgJS-SKzHM",
  authDomain: "caloriecounter-e12b6.firebaseapp.com",
  projectId: "caloriecounter-e12b6",
  storageBucket: "caloriecounter-e12b6.firebasestorage.app",
  messagingSenderId: "1004830904089",
  appId: "1:1004830904089:web:c12b69b17b58e7a4207f88",
}

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }
export default app
