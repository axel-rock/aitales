import { auth } from '$lib/firebase/client'
import { onAuthStateChanged } from 'firebase/auth'
import type { LayoutLoad } from './$types'

export const load = (async () => {
	const user = await new Promise((resolve) => {
		onAuthStateChanged(auth, resolve)
	})
	return { user }
}) satisfies LayoutLoad
