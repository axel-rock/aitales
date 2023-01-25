import type { LayoutLoad } from './$types'
import { limit, where } from 'firebase/firestore'
import { queryCollection } from '$lib/firebase/client'
import { Story } from '$lib/stories/story'
import type { User } from 'firebase/auth'

export const load = (async ({ parent }) => {
	const { user, access } = await parent()
	return {
		stories: await getStories(user)
	}
}) satisfies LayoutLoad

async function getStories(user: User) {
	const storiesSnapshot = await queryCollection(
		'stories',
		// where(),
		limit(10)
	)

	const stories = Promise.all(
		storiesSnapshot.map(async (story) => {
			if (user) return Story.init(story, user)
			else return new Story(story)
		})
	)

	return stories
}
