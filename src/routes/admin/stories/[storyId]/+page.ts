import type { PageLoad } from './$types'
import { limit } from 'firebase/firestore'
import { getDoc, queryCollection } from '$lib/firebase'
import { Story } from '$lib/story'

export const load = (async ({ params }) => {
	return {
		story: Story.getFromId(params.storyId)
	}
}) satisfies PageLoad
