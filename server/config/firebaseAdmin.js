import admin from "firebase-admin"

const privateKey =
    process.env.FIREBASE_PRIVATE_KEY
        ?.replace(/\\n/g, "\n")

const serviceAccount = {

    projectId:
        process.env.FIREBASE_PROJECT_ID,

    clientEmail:
        process.env.FIREBASE_CLIENT_EMAIL,

    privateKey

}

admin.initializeApp({

    credential:
        admin.credential.cert(
            serviceAccount
        )

})

export default admin