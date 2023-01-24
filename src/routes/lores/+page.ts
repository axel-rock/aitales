import type { PageServerLoad } from './$types'
import { limit, where } from 'firebase/firestore'
import { queryCollection } from '$lib/firebase/client'
import { currentUser } from '$lib/_user'
import { get, writable } from 'svelte/store'

export const prerender = false

const user = get(currentUser)

const lores = writable([])

currentUser.subscribe((user) => {
	if (user) lores.set(queryCollection('lores', limit(10), where('user', '==', user.uid)))
})

export const load: PageServerLoad = async ({ params, locals }) => {
	console.log('lores/+page.ts', { locals })
	return {
		lores
	}
}
