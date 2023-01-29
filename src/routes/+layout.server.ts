import type { LayoutServerLoadEvent } from './$types'
import { getUserFromCookieToken, getAccess } from '$lib/firebase/admin'

export const load = async ({ cookies, locals }: LayoutServerLoadEvent) => {
	// const { user, access } = locals
	let user, access
	if (!user && cookies.get('token')) {
		user = await getUserFromCookieToken(cookies.get('token') as string)
		user = user?.toJSON()
		if (user) {
			access = await getAccess(user)
		}
	}

	console.log('+layout.server.ts load()', { user, access })

	return {
		user,
		access
	}
}
