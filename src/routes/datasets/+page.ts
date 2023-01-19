import type { PageServerLoad } from './$types'
import { limit, where } from 'firebase/firestore'
import { queryCollection } from '$lib/firebase/client'
import { currentUser } from '$lib/user'
import { get, writable } from 'svelte/store'

export const prerender = false

const user = get(currentUser)

const datasets = writable([])

currentUser.subscribe((user) => {
	if (user) datasets.set(queryCollection('datasets', limit(10), where('user', '==', user.uid)))
})

export const load: PageServerLoad = async ({ params, locals }) => {
	return {
		datasets
	}
}
