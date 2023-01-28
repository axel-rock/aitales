import type { LayoutServerLoadEvent } from './$types'

export const load = async ({ cookies, locals }: LayoutServerLoadEvent) => {
	const { user, access } = locals
	console.log('layout.server.ts', 'locals', locals?.user?.uid)
	console.log('layout.server.ts', 'load', user?.uid)
	return {
		user,
		access
	}
}
