import type { PageLoad } from './$types'
import { limit, where } from 'firebase/firestore'
import { queryCollection } from '$lib/firebase'
import { currentUser } from '$lib/auth'
import { get } from 'svelte/store'

import { writable } from 'svelte/store'

let stories

export const load = (async ({ params }) => {
	return {
		stories: queryCollection(
			'stories',
			// where(),
			limit(10)
		)
	}
}) satisfies PageLoad
