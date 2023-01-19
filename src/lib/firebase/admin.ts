import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { PUBLIC_PROJECTID } from '$env/static/public'

import { FIREBASE_ADMIN_PRIVATE_KEY, FIREBASE_ADMIN_CLIENT_EMAIL } from '$env/static/private'

function makeApp() {
	const apps = getApps()
	if (apps.length > 0) {
		return apps[0]!
	}
	return initializeApp({
		credential: cert({
			privateKey: FIREBASE_ADMIN_PRIVATE_KEY,
			clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL,
			projectId: PUBLIC_PROJECTID
		}),
		databaseURL: `https://${PUBLIC_PROJECTID}.firebaseio.com`
	})
}

export const firebase = makeApp()
export const firestore = getFirestore()
export const auth = getAuth(firebase)
