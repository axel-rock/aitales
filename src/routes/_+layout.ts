import { auth, getDoc } from '$lib/firebase/client'
import { onAuthStateChanged, type User } from 'firebase/auth'
import type { LayoutLoad } from './$types'

export const load = (async () => {
	const user = new Promise((resolve) => {
		onAuthStateChanged(auth, (user: User | null) => {
			resolve(user)
		})
	})

	const access = new Promise(async (resolve) => {
		try {
			const _user = await user
			const access = await getDoc(`access/${_user?.uid}`)
			resolve({ ...access, public: true })
		} catch (e) {
			resolve({ public: true })
		}
	})

	return {
		// user,
		// access
	}
}) satisfies LayoutLoad
