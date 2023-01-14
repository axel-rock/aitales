import type { PageLoad } from './$types'
import { limit } from 'firebase/firestore'
import { queryCollection } from '$lib/firebase'

export const load = (async ({ params }) => {
	return {
		stories: queryCollection('stories', limit(10))
	}
}) satisfies PageLoad
