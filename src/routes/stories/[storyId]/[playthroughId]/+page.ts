import { db, getDoc } from '$lib/firebase/client'
import { doc, onSnapshot } from 'firebase/firestore'
import { readable } from 'svelte/store'
import type { PageLoad } from './$types'

export const load = (async ({ params, parent }) => {
	const { stories, playthroughs, user, access } = await parent()
	const story = stories.find((story) => story.id === params.storyId)
	const playthrough = playthroughs.find((playthrough) => playthrough.storyId === params.storyId)
	const passages = playthroughPassagesAsStore(playthrough)

	return {
		story,
		playthrough,
		passages
	}
}) satisfies PageLoad

const playthroughPassagesAsStore = (playthrough: any) =>
	readable(null, (set) => {
		const unsubscribe = onSnapshot(doc(db, 'playthroughs', playthrough.id), async (doc) => {
			const playthrough = doc.data()
			const passages = await Promise.all(
				playthrough.passagesRef.map((passageRef) => getDoc(passageRef))
			)
			set(passages)
		})

		return () => {
			unsubscribe()
		}
	})
