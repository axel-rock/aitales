import cookie from 'cookie'
import { browser } from '$app/environment'
import { GoogleAuthProvider, type User, signInWithPopup, signOut as _signOut } from 'firebase/auth'
import { writable } from 'svelte/store'
import { auth } from '../firebase/client'

// export const user = writable<User | null>(null)

export async function signOut() {
	await _signOut(auth)
	await fetch('/api/auth', {
		method: 'DELETE'
	})
	console.log('sign out')
	document.location.reload()
}

export async function signIn() {
	console.log('stores/auth.ts', 'signIn()')
	const credentials = await signInWithPopup(auth, new GoogleAuthProvider())
	const token = await credentials.user?.getIdToken()
	await fetch('/api/auth', {
		method: 'POST',
		body: JSON.stringify({ token })
	})
	console.log('stores/auth.ts', 'signedIn')
	document.location.reload()
}

if (browser)
	auth.onAuthStateChanged(async (user) => {
		console.log('auth.onAuthStateChanged', user)
		const token = await user?.getIdToken()
		if (token)
			await fetch('/api/auth', {
				method: 'POST',
				body: JSON.stringify({ token })
			})
	})

// if (browser) {
// 	auth.onIdTokenChanged(async (newUser) => {
// 		console.log('stores/auth.ts', 'onIdTokenChanged start')
// 		const tokenCurrentlySet = cookie.parse(document.cookie)['token'] !== undefined
// 		const token = newUser ? await newUser?.getIdToken() : undefined
// 		document.cookie = cookie.serialize('token', token ?? '', {
// 			path: '/',
// 			maxAge: token ? undefined : 0
// 		})
// 		console.log(newUser)
// 		user.set(newUser)
// 		if (!tokenCurrentlySet && token) {
// 			document.location.reload()
// 		}
// 		console.log('stores/auth.ts', 'onIdTokenChanged done')
// 	})

// 	// refresh the ID token every 10 minutes
// 	setInterval(async () => {
// 		if (auth.currentUser) {
// 			console.log('stores/auth.ts', 'getIdToken')
// 			await auth.currentUser.getIdToken(true)
// 		}
// 	}, 10 * 60 * 1000)
// }
