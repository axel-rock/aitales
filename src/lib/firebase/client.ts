import {
	PUBLIC_APIKEY,
	PUBLIC_AUTHDOMAIN,
	PUBLIC_PROJECTID,
	PUBLIC_STORAGEBUCKET,
	PUBLIC_MESSAGINGSENDERID,
	PUBLIC_APPID,
	PUBLIC_MEASUREMENTID
} from '$env/static/public'
import {
	getFirestore,
	getDocs,
	doc as _doc,
	getDoc as _getDoc,
	query,
	collection,
	QueryConstraint
} from 'firebase/firestore'
import { initializeApp, getApp, getApps } from 'firebase/app'
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut as _signOut } from 'firebase/auth'

export const firebaseConfig = {
	apiKey: PUBLIC_APIKEY,
	authDomain: PUBLIC_AUTHDOMAIN,
	projectId: PUBLIC_PROJECTID,
	storageBucket: PUBLIC_STORAGEBUCKET,
	messagingSenderId: PUBLIC_MESSAGINGSENDERID,
	appId: PUBLIC_APPID
	// measurementId: PUBLIC_MEASUREMENTID
}

export const makeApp: () => FirebaseApp = () => {
	if (getApps().length) return getApp()
	return initializeApp(firebaseConfig)
}

export const app = makeApp()
export const firestore = getFirestore(app)
export const auth = getAuth(app)
export const db = firestore

export const getDoc = async (path: string, ...pathSegments: string[]) => {
	const snapshot = await _getDoc(_doc(db, path, ...pathSegments))
	return {
		id: snapshot.id,
		ref: snapshot.ref,
		...snapshot.data()
	}
}

export const queryCollection = async (ref: string, ...queries: QueryConstraint[]) => {
	const snapshots = await getDocs(query(collection(db, ref), ...queries))
	return snapshots.docs.map((snapshot) => {
		return {
			id: snapshot.id,
			ref: snapshot.ref,
			...snapshot.data()
		}
	})
}

export const newRef = async (ref: string) => _doc(collection(db, ref))

export const signInWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider())

export const signOut = () => _signOut(auth)
