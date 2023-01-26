import type { LayoutLoad } from './$types'
import { limit, where } from 'firebase/firestore'
import { queryCollection } from '$lib/firebase/client'
import { Story } from '$lib/stories/story'
import type { User } from 'firebase/auth'

export const load = (async ({ parent }) => {
	const { user, access } = await parent()
	return {
		stories: await getStories(user, access),
		playthroughs: await getPlaythroughs(user)
	}
}) satisfies LayoutLoad

async function getPlaythroughs(user: User) {
	return queryCollection('playthroughs', where('userId', '==', user.uid), limit(10))
}

async function getStories(user: User, access: any) {
	access = Object.keys(access)
	const storiesSnapshot = await queryCollection(
		'stories',
		where('access', 'array-contains-any', access),
		limit(10)
	)

	const stories = Promise.all(
		storiesSnapshot.map(async (story) => {
			if (user) return Story.init(story, user, 1)
			else return new Story(story, null, 1)
		})
	)

	return stories
}
