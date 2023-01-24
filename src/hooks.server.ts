import type { Handle } from '@sveltejs/kit'
import { auth, firestore } from '$lib/firebase/admin'
import type { DecodedIdToken, UserRecord } from 'firebase-admin/auth'

export const handle: Handle = async ({ event, resolve }) => {
	const { cookies, locals } = event

	if (cookies.get('token')) {
		try {
			const token = cookies.get('token')
			let user: DecodedIdToken | UserRecord | null = token ? await auth.verifyIdToken(token) : null
			user = user ? await auth.getUser(user.uid) : null
			locals.user = user?.toJSON()
			if (user) {
				const accessSnapshot = await firestore.collection('access').doc(user.uid).get()
				let access = accessSnapshot.data()
				access = { ...access, public: true }
				locals.access = access
			}
		} catch (e) {
			cookies.set('token', '', { maxAge: -1 })
		}
	}

	if (event.url.pathname.startsWith('/admin') && !locals.access?.admin) {
		return Response.redirect('/', 307)
	}

	return resolve(event)
}
