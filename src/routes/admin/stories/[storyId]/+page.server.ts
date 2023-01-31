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
				passage.vector = await embeddings(passage.text)
				if (passage.tags?.includes('prompt') && passage.links?.length > 0) {
					for (let index = 0; index < passage.links.length; index++) {
						const link = passage.links[index]
						passage.links[index].vector = await embeddings(passage.links[index].name)
					}
				}
				firestore.doc(`stories/${storyId}/passages/${passage.id}`).set(passage.asObject)
			})
		)

		return {}
	},

	generateAudio: async ({ cookies, request }) => {
		let data = await request.formData()
		data = Object.fromEntries(data.entries())

		// To Do: Check if user is logged in and record its usage
		const synthesizer = new SpeechSynthesis(data)

		try {
			const audio = await synthesizer.synthesize()
			await firestore.doc(data.ref).set({ audio }, { merge: true })
		} catch (e) {
			return {
				success: false
			}
		}

		return {
			success: true
		}
	},

	generateAllAudio: async ({ request }) => {
		const data = await request.formData()
		const { path, ref, lang } = Object.fromEntries(data.entries())

		const passagesSnapshot = await firestore
			.doc(ref as string)
			.collection(Passage.collection)
			.get()

		await Promise.all(
			passagesSnapshot.docs.map(async (doc) => {
				const passage = doc.data() as Passage
				const synthesisOptions = {
					text: Passage.cleanText(passage.text),
					path: `${path}/${passage.name || passage.id}`,
					lang
				}
				const synthesizer = new SpeechSynthesis(synthesisOptions)
				const audio = await synthesizer.synthesize()
				return firestore
					.doc(ref as string)
					.collection(Passage.collection)
					.doc(passage.id)
					.set({ audio }, { merge: true })
			})
		)

		console.log('done')
	}
}
