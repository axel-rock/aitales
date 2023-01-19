import cookie from 'cookie'
import { browser } from '$app/environment'
import { GoogleAuthProvider, type User, signInWithPopup } from 'firebase/auth'
import { writable } from 'svelte/store'
import { auth } from '../firebase/client'

export const user = writable<User | null>(null)

export async function signOut() {
	await auth.signOut()
	document.location.reload()
}

export async function signIn() {
	await signInWithPopup(auth, new GoogleAuthProvider())
}

if (browser) {
	auth.onIdTokenChanged(async (newUser) => {
		console.log('lib/stores/auth.ts', { newUser })
		const tokenCurrentlySet = cookie.parse(document.cookie)['token'] !== undefined
		const token = newUser ? await newUser?.getIdToken() : undefined
		document.cookie = cookie.serialize('token', token ?? '', {
			path: '/',
			maxAge: token ? undefined : 0
		})
		user.set(newUser)
		if (!tokenCurrentlySet && token) {
			document.location.reload()
		}
	})

	// refresh the ID token every 10 minutes
	setInterval(async () => {
		if (auth.currentUser) {
			await auth.currentUser.getIdToken(true)
		}
	}, 10 * 60 * 1000)
}
