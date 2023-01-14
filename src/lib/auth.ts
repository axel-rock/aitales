import { readable } from 'svelte/store'
import {
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	signOut as _signOut,
	type Auth,
	type User as FirebaseUser
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { app, db } from './firebase'
export const auth: Auth = getAuth(app)

export class User {
	uid: string
	displayName: string | null
	photoURL: string | null

	private private: {
		email: string | null
	}

	access: {
		isPro: boolean | null
	}

	ready: Promise<[void, void]>

	constructor(user: FirebaseUser) {
		this.uid = user.uid
		this.displayName = user.displayName

		this.private = {
			email: user.email
		}

		this.photoURL = user.photoURL

		this.access = {
			isPro: false
		}

		this.ready = Promise.all([
			getDoc(doc(db, User.collection, this.uid)).then((doc) => {
				if (doc.exists()) {
					const data = doc.data()
				}
			}),
			getDoc(doc(db, User.accessCollection, this.uid)).then((doc) => {
				if (doc.exists()) {
					this.access = doc.data()
				}
			})
		])
	}

	async sync() {
		const userRef = doc(db, User.collection, this.uid)
		const { access, ready, ...user } = this
		return setDoc(userRef, user, { merge: true })
	}

	static get collection() {
		return 'users'
	}

	static get accessCollection() {
		return 'access'
	}

	// get email() {
	// 	return this.private.email
	// }
}

export const currentUser = readable<User | null>(null, (set) => {
	const unsubscribe = auth.onAuthStateChanged(async (_user: FirebaseUser | null) => {
		if (_user) {
			const user = new User(_user)
			await user.ready
			await user.sync()
			set(user)
		} else {
			set(null)
		}
	})
	return () => unsubscribe()
})

export const signInWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider())
export const signOut = () => _signOut(auth)
