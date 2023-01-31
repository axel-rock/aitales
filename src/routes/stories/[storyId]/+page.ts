import type { PageLoad } from './$types'

export const load = (async ({ params, parent }) => {
	const { stories, playthroughs, user, access } = await parent()
	const story = stories.find((story) => story.id === params.storyId)
	const passages = story?.passages

	return {
		story,
		passages
	}
}) satisfies PageLoad
