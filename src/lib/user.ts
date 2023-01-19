import { readable } from 'svelte/store'
import { getAuth, type Auth, type User as FirebaseUser } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { app, db, getDoc } from './firebase/client'
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

	ready: Promise<User>

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

		this.ready = getDoc(User.collection, this.uid)

		this.access = getDoc(User.accessCollection, this.uid)
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

export const getCurrentUser = () =>
	new Promise((resolve) => {
		currentUser.subscribe((user) => {
			if (user) {
				resolve(user)
			}
		})
	})
