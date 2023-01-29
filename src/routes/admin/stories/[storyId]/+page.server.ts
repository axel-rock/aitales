import type { Actions } from '@sveltejs/kit'
import { SpeechSynthesis } from '$lib/server/api/microsoft'
import { firestore } from '$lib/firebase/admin'
import { Passage } from '$lib/stories/passage'
import { embeddings } from '$lib/server/api/openai'

export const actions: Actions = {
	jsonToPassages: async ({ request }) => {
		const data = await request.formData()
		const storyId = data.get('storyId') as string
		let json = data.get('json') as string

		try {
			json = JSON.parse(json)
		} catch (e) {
			return {
				success: false
			}
		}

		let passages = json.passages || []

		if (json.passages?.length > 0) passages = passages.map((passage) => new Passage(passage))

		await Promise.all(
			passages.map(async (passage) => {
				console.log('stories', storyId, 'passages', passage.id)
				passage.vector = await embeddings(passage.text)

				return firestore.doc(`stories/${storyId}/passages/${passage.id}`).set(passage.asObject)
			})
		)

		// console.log(passages)

		return {}
	},

	generateAudio: async ({ cookies, request }) => {
		console.log('admin/stories/[storyId]/+page.server.ts', 'start generate audio')
		let data = await request.formData()
		data = Object.fromEntries(data.entries())

		const synthesizer = new SpeechSynthesis(data)

		try {
			console.log('admin/stories/[storyId]/+page.server.ts', 'Start synthesizer')
			const audio = await synthesizer.synthesize()
			console.log(audio)
			console.log(
				'admin/stories/[storyId]/+page.server.ts',
				'Synthesized received. Saving to firestore'
			)
			console.log(data.ref)
			await firestore.doc(data.ref).set({ audio }, { merge: true })
		} catch (e) {
			console.log('admin/stories/[storyId]/+page.server.ts', 'Error caught', e)
			return {
				success: false
			}
		}

		console.log('admin/stories/[storyId]/+page.server.ts', 'Complete')

		return {
			success: true
		}
	}
}
