import type { Actions } from '@sveltejs/kit'
import { SpeechSynthesis } from '$lib/server/api/microsoft'
import { firestore } from '$lib/firebase/admin'
import { doc, setDoc } from 'firebase/firestore'
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
				console.log('stories', storyId, 'passages', passage.pid)
				passage.vector = await embeddings(passage.text)
				return firestore.doc(`stories/${storyId}/passages/${passage.pid}`).set(passage.asObject())
			})
		)

		console.log(passages)

		return {}
	},

	generateAudio: async ({ cookies, request }) => {
		let data = await request.formData()
		data = Object.fromEntries(data.entries())

		const synthesizer = new SpeechSynthesis(data)

		try {
			const snapshot = await synthesizer.synthesize()
			await setDoc(
				doc(db, data.ref),
				{ audio: data.path + '.' + SpeechSynthesis.format },
				{ merge: true }
			)
		} catch (e) {
			return {
				success: false
			}
		}

		return {
			success: true
		}
	}
}
