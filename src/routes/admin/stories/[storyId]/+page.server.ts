import type { Actions } from '@sveltejs/kit'
import { SpeechSynthesis } from '$lib/server/api/microsoft'
import { db } from '$lib/firebase'
import { doc, setDoc } from 'firebase/firestore'

export const actions: Actions = {
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
			console.log(e)
			return {
				success: false
			}
		}

		return {
			success: true
		}
	}
}
