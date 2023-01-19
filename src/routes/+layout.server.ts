import type { LayoutServerLoadEvent } from './$types'

export const load = async ({ cookies, locals }: LayoutServerLoadEvent) => {
	const { user, access } = locals
	return {
		user,
		access
	}
}
