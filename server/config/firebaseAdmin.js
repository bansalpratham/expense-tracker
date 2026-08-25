import { cert, getApps, initializeApp } from "firebase-admin/app"

const privateKey =
    process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")

const firebaseConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,

    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,

    privateKey
}

const firebaseApp =
    getApps().length > 0
        ? getApps()[0]
        : initializeApp({
              credential: cert(firebaseConfig)
          })

export default firebaseApp