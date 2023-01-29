import { dev } from '$app/environment'
import type { RequestHandler } from './$types'
import { auth } from '$lib/firebase/admin'

const expiresIn = 1000 * 60 * 60 * 24 * 7
const secure = dev ? '' : 'Secure;'

export const POST = (async ({ request }) => {
	const { token } = await request.json()
	try {
		const sessionCookie = await auth.createSessionCookie(token, {
			expiresIn: 60 * 60 * 24 * 5 * 1000
		})
		return new Response(sessionCookie, {
			status: 200,
			headers: {
				'set-cookie': `token=${sessionCookie}; Max-Age=${expiresIn}; Path=/; HttpOnly; ${secure};`
			}
		})
	} catch (e) {}
	return new Response(null, {
		status: 500
	})
}) satisfies RequestHandler

export const DELETE = (async () => {
	return new Response(null, {
		status: 200,
		headers: {
			'set-cookie': `token=_; Path=/; HttpOnly; Max-Age=0; ${secure};`
		}
	})
}) satisfies RequestHandler
