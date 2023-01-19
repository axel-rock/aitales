import type { Handle } from '@sveltejs/kit'
import { auth, firestore } from '$lib/firebase/admin'

export const handle: Handle = async ({ event, resolve }) => {
	const { cookies, locals } = event

	if (cookies.get('token')) {
		try {
			const token = cookies.get('token')
			const user = token ? await auth.verifyIdToken(token) : null
			locals.user = user
			if (user) {
				locals.access = await (await firestore.collection('access').doc(user.uid).get()).data()
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
