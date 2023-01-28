import cookie from 'cookie'
import { browser } from '$app/environment'
import { GoogleAuthProvider, type User, signInWithPopup } from 'firebase/auth'
import { auth } from '$lib/firebase/client'

export async function signIn() {
	const credentials = await signInWithPopup(auth, new GoogleAuthProvider())
	const token = await credentials.user?.getIdToken()
	await fetch('/auth', {
		method: 'POST',
		body: JSON.stringify({ token })
	})
	document.location.reload()
}

export async function signOut() {
	await auth.signOut()
	await fetch('/auth', {
		method: 'DELETE'
	})
	document.location.reload()
}

if (browser) {
	auth.onAuthStateChanged(async (newUser: User | null) => {
		const tokenCurrentlySet = cookie.parse(document.cookie)['token'] !== undefined
		const token = newUser ? await newUser?.getIdToken() : undefined
		console.log(tokenCurrentlySet, token)
		// document.cookie = cookie.serialize('token', token ?? '', {
		// 	path: '/',
		// 	maxAge: token ? undefined : 0
		// })
		// if (!tokenCurrentlySet && token) {
		// 	document.location.reload()
		// }
	})
}

// if (browser) {
// 	auth.onIdTokenChanged(async (newUser) => {
// 		const tokenCurrentlySet = cookie.parse(document.cookie)['token'] !== undefined
// 		const token = newUser ? await newUser?.getIdToken() : undefined
// 		document.cookie = cookie.serialize('token', token ?? '', {
// 			path: '/',
// 			maxAge: token ? undefined : 0
// 		})
// 		if (!tokenCurrentlySet && token) {
// 			document.location.reload()
// 		}
// 	})

// 	// refresh the ID token every 10 minutes
// 	setInterval(async () => {
// 		if (auth.currentUser) {
// 			await auth.currentUser.getIdToken(true)
// 		}
// 	}, 10 * 60 * 1000)
// }
