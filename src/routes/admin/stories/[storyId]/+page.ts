import type { PageLoad } from './$types'

export const load = (async ({ params, parent }) => {
	const { stories } = await parent()
	const story = stories.find((story) => story.id === params.storyId)

	return {
		story,
		passages: story.passages,
		progress: story.progress
	}
}) satisfies PageLoad
