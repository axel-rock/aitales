import type { Handle } from '@sveltejs/kit'
import { auth, firestore } from '$lib/firebase/admin'
import type { DecodedIdToken, UserRecord } from 'firebase-admin/auth'

export const handle: Handle = async ({ event, resolve }) => {
	const { cookies, locals } = event

	log('handle', event.url.pathname, event.isDataRequest)
	log(event)

	const token = cookies.get('token')

	if (!token) return resolve(event)

	log('got token')
	try {
		const token = cookies.get('token')
		// let user: DecodedIdToken | UserRecord | null = token ? await auth.verifyIdToken(token) : null
		let user: DecodedIdToken | UserRecord | null = token
			? await auth.verifySessionCookie(token)
			: null

		if (!user) {
			return resolve(event)
		}
		// log('verifyToken', user)
		log('verifyToken', 'uid', user.uid)
		user = user ? await auth.getUser(user.uid) : null
		event.locals.user = user?.toJSON() as UserRecord

		log('got user', user?.displayName)

		const accessSnapshot = await firestore.collection('access').doc(user?.uid).get()
		let access = accessSnapshot.data()
		access = { ...access, public: true }
		event.locals.access = access
	} catch (e) {
		log('error', e)
		cookies.set('token', '', { maxAge: -1 })
	}

	if (event.url.pathname.startsWith('/admin') && !event.locals.access?.admin) {
		return Response.redirect('/', 307)
	}

	log('resolve event.locals.user.displayName', event.locals?.user?.displayName)
	return resolve(event)
}

function log(...args: any[]) {
	// console.log('hooks.server.ts', ...args)
}
