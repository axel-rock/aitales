import type { LayoutLoad } from './$types'
import { limit, where } from 'firebase/firestore'
import { queryCollection } from '$lib/firebase/client'
import { Story } from '$lib/stories/story'
import type { UserRecord } from 'firebase-admin/auth'

export const load = (async ({ parent }) => {
	const { user, access } = await parent()
	return {
		stories: await getStories(user as UserRecord, access),
		playthroughs: await getPlaythroughs(user as UserRecord)
	}
}) satisfies LayoutLoad

async function getPlaythroughs(user: UserRecord) {
	if (!user) return []
	return queryCollection('playthroughs', where('userId', '==', user.uid), limit(10))
}

async function getStories(user: UserRecord, access: any) {
	access = Object.keys(access)
	const storiesSnapshot = await queryCollection(
		'stories',
		where('access', 'array-contains-any', access),
		limit(10)
	)

	const stories = Promise.all(
		storiesSnapshot.map(async (story) => {
			if (user) return Story.init(story as any, user as any, 1)
			else return new Story(story, undefined, 1)
		})
	)

	return stories
}
