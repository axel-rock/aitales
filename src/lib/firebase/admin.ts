import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth, UserRecord } from 'firebase-admin/auth'
import { getStorage } from 'firebase-admin/storage'
import { PUBLIC_PROJECTID, PUBLIC_STORAGEBUCKET } from '$env/static/public'

import { PRIVATE_FIREBASE_ADMIN_KEY, PRIVATE_FIREBASE_ADMIN_CLIENT_EMAIL } from '$env/static/private'

function makeApp() {
	const apps = getApps()
	if (apps.length > 0) {
		return apps[0]!
	}

	return initializeApp({
		credential: cert({
			privateKey: PRIVATE_FIREBASE_ADMIN_KEY,
			clientEmail: PRIVATE_FIREBASE_ADMIN_CLIENT_EMAIL,
			projectId: PUBLIC_PROJECTID
		}),
		databaseURL: `https://${PUBLIC_PROJECTID}.firebaseio.com`,
		storageBucket: PUBLIC_STORAGEBUCKET
	})
}

export const firebase = makeApp()
export const firestore = getFirestore()
export const auth = getAuth(firebase)
export const bucket = getStorage(firebase).bucket(PUBLIC_STORAGEBUCKET)

export const getUserFromSessionCookie = async (token: string) => {
	const user = token ? await auth.verifySessionCookie(token) : null
	if (!user) return null
	return auth.getUser(user.uid)
}

export const getAccess = async (user: UserRecord) => {
	const accessSnapshot = await firestore.collection('access').doc(user.uid).get()
	const access = accessSnapshot.data()
	return { ...access, public: true }
}
