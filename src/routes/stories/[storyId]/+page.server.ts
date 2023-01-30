import type { Actions } from './$types'
import { getUserFromSessionCookie } from '$lib/firebase/admin'
import { Playthrough } from '$lib/stories/playthrough'
import { redirect } from '@sveltejs/kit'
import type { UserRecord } from 'firebase-admin/auth'

export const actions: Actions = {
	continue: async ({ cookies, request }) => {
		const user = await getUserFromSessionCookie(cookies.get('__session') as string)

		const { storyId, nextPassageId } = Object.fromEntries(await request.formData())

		const playthrough: Playthrough = await Playthrough.fromStoryIdAndUser(
			storyId as string,
			user as UserRecord
		)

		await playthrough.addPassageId(nextPassageId as string)

		throw redirect(301, `/stories/${storyId}/${playthrough.id}`)
	}
}
