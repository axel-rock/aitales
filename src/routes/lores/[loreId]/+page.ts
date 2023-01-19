import type { PageLoad } from './$types'
import { limit, where } from 'firebase/firestore'
import { queryCollection, getDoc } from '$lib/firebase/client'
import { currentUser } from '$lib/user'
import { get, writable } from 'svelte/store'

export const ssr = false

const lore = writable(null)

export const load: PageLoad = async ({ params, locals }) => {
	return {
		lore: getDoc('lores', params.loreId)
	}
}
