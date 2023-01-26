import type { Actions } from './$types'
import { embeddings, completion } from '$lib/server/api/openai'
import { query } from '$lib/server/api/pinecone'
import { firestore, getUserFromCookieToken } from '$lib/firebase/admin'
import { Playthrough } from '$lib/stories/playthrough'
import type { User } from 'firebase/auth'
import type { Passage } from '$lib/stories/passage'
import { redirect } from '@sveltejs/kit'

export const actions: Actions = {
	continue: async ({ cookies, request }) => {
		const user = await getUserFromCookieToken(cookies.get('token') as string)

		const { storyId, nextPassageId } = Object.fromEntries(await request.formData())

		const playthrough: Playthrough = await Playthrough.fromStoryIdAndUser(
			storyId as string,
			user as User
		)

		await playthrough.addPassageId(nextPassageId as string)

		throw redirect(301, `/stories/${storyId}/${playthrough.id}`)
	}
}
