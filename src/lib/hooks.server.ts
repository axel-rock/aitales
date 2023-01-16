import type { Handle } from '@sveltejs/kit'

export const handle = (async ({ event, resolve }) => {
	event.locals.user = {
		name: 'test'
	}

	const response = await resolve(event)
	return response
}) satisfies Handle
