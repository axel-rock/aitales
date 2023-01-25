import { firestore } from '$lib/firebase/admin'
import { SpeechSynthesis } from '$lib/server/api/microsoft'
import { FieldValue } from 'firebase-admin/firestore'
import type { User } from 'firebase/auth'
import { Passage } from './passage'
import type { Story } from './story'

// This class should only be used on the server

export class Playthrough {
	id: string
	story: Story
	user: User
	passagesRef: [string?]

	constructor(story: Story, user: User, id?: string, passagesRef?: [string?]) {
		this.id = id || firestore.collection(Playthrough.collection).doc().id
		this.story = story
		this.user = user
		this.passagesRef = passagesRef || []
		if (this.passagesRef.length === 0) this.addPassageId(this.story.startPassageId)
	}

	addPassageId(passageId: string) {
		this.passagesRef.push(`${this.story.ref}/${Passage.collection}/${passageId}`)
	}

	async addPassageFromRef(ref: string) {
		this.passagesRef.push(ref)
		return this.save()
	}

	async addPassageFromText(text: string, type?: string) {
		const passageDoc = firestore
			.collection(Playthrough.collection)
			.doc(this.id)
			.collection(Passage.collection)
			.doc()

		const audio = await this.generateAudio(text, passageDoc.path)

		const passage = new Passage({
			id: passageDoc.id,
			text,
			audio,
			type,
			timestamp: FieldValue.serverTimestamp()
		} as Passage)

		await passageDoc.set(passage.asObject)

		this.passagesRef.push(passageDoc.path)

		return this.save()
	}

	async addInput(input: string) {
		return this.addPassageFromText(input, 'input')
	}

	async addPrompt(prompt: string) {
		return this.addPassageFromText(prompt, 'prompt')
	}

	async addCompletion(completion: string) {
		return this.addPassageFromText(completion, 'completion')
	}

	async generateAudio(text: string, path: string) {
		const synthesizer = new SpeechSynthesis({
			text,
			lang: this.story.lang,
			path
		})

		try {
			const snapshot = await synthesizer.synthesize()
			return path + '.' + SpeechSynthesis.format
		} catch (e) {
			console.log('lib/stories/playthrough.ts', 'Error generating audio:', e)
			return null
		}
	}

	save() {
		return firestore.collection(Playthrough.collection).doc(this.id).set({
			storyId: this.story.id,
			userId: this.user.uid,
			passagesRef: this.passagesRef,
			lastUpdated: FieldValue.serverTimestamp()
		})
	}

	reset() {
		this.passagesRef.splice(1)
		return this.save()
	}

	static async fromStoryIdAndUser(
		storyId: string,
		user: User,
		id?: string,
		passagesRef?: [string?]
	) {
		const storyDoc = firestore.collection('stories').doc(storyId)
		let story: any = await storyDoc.get()
		story = story.data()
		story = { id: storyDoc.id, ref: storyDoc.path, ...story } as Story
		return new Playthrough(story, user, id, passagesRef)
	}

	static async getFromId(playthroughId: string) {
		const playthroughDoc = await firestore
			.collection(Playthrough.collection)
			.doc(playthroughId)
			.get()
		const playthroughData = playthroughDoc.data()
		const user = await (
			await firestore.collection('users').doc(playthroughData.userId).get()
		).data()

		return Playthrough.fromStoryIdAndUser(
			playthroughData.storyId,
			user,
			playthroughId,
			playthroughData.passagesRef
		)
	}

	static get collection() {
		return 'playthroughs'
	}
}
