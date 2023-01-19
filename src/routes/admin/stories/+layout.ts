import type { LayoutLoad } from './$types'
import { limit, where } from 'firebase/firestore'
import { queryCollection } from '$lib/firebase/client'
import { Story } from '$lib/stories/story'

export const load = (async () => {
	return {
		stories: (
			await queryCollection(
				'stories',
				// where(),
				limit(10)
			)
		).map((story) => new Story(story))
	}
}) satisfies LayoutLoad
