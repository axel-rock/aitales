import { firestore } from '$lib/firebase/admin'
import { SpeechSynthesis } from '$lib/server/api/microsoft'
import type { UserRecord } from 'firebase-admin/auth'
import { FieldValue } from 'firebase-admin/firestore'
import { Link, Passage } from './passage'
import type { Story } from './story'

// This class should only be used on the server

export class Playthrough {
	id: string
	story: Story
	userId: string
	passagesRef: [string?]

	constructor(story: Story, userId: string, id?: string, passagesRef?: [string?]) {
		this.id = id || firestore.collection(Playthrough.collection).doc().id
		this.story = story
		// To do: change all instances of user to userId. Then, remove
		this.userId = userId
		this.passagesRef = passagesRef || []
		if (this.passagesRef.length === 0) this.addPassageId(this.story.startPassageId)
	}

	addPassageId(passageId: string) {
		this.passagesRef.push(`${this.story.ref}/${Passage.collection}/${passageId}`)
		return this.save()
	}

	addPassageFromRef(ref: string) {
		this.passagesRef.push(ref)
		return this.save()
	}

	async createPassageFromRefWithText(ref: string, text: string) {
		const passageDoc = await firestore.doc(ref).get()
		const passage = new Passage(passageDoc.data() as Passage)

		return this.addPassageFromText(text, 'completion', passage.links, passage.tags)
	}

	async addPassageFromText(text: string, type?: string, links?: Link[], tags?: string[]) {
		const passageDoc = firestore
			.collection(Playthrough.collection)
			.doc(this.id)
			.collection(Passage.collection)
			.doc()

		let audio
		if (type !== 'input' && type !== 'prompt')
			audio = await this.generateAudio(Passage.cleanText(text), passageDoc.path)

		const passage = new Passage({
			id: passageDoc.id,
			text,
			audio,
			type,
			links,
			tags,
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
			return synthesizer.synthesize()
		} catch (e) {
			console.log('lib/stories/playthrough.ts', 'Error generating audio:', e)
			return null
		}
	}

	save() {
		return firestore.collection(Playthrough.collection).doc(this.id).set({
			storyId: this.story.id,
			userId: this.userId,
			passagesRef: this.passagesRef,
			lastUpdated: FieldValue.serverTimestamp()
		})
	}

	async reset() {
		const passagesToDelete = this.passagesRef.splice(1)
		await Promise.all(
			passagesToDelete.map((ref) => {
				if (ref?.startsWith(Playthrough.collection)) {
					return firestore.doc(ref).delete()
				}
				return Promise.resolve()
			})
		)
		return this.save()
	}

	static async fromStoryIdAndUserId(
		storyId: string,
		userId: string,
		id?: string,
		passagesRef?: [string?]
	) {
		const storyDoc = firestore.collection('stories').doc(storyId)
		let story: any = await storyDoc.get()
		story = story.data()
		story = { id: storyDoc.id, ref: storyDoc.path, ...story } as Story
		return new Playthrough(story, userId, id, passagesRef)
	}

	static async getFromId(playthroughId: string) {
		const playthroughDoc = await firestore
			.collection(Playthrough.collection)
			.doc(playthroughId)
			.get()
		const playthroughData = playthroughDoc.data()

		return Playthrough.fromStoryIdAndUserId(
			playthroughData?.storyId,
			playthroughData?.userId,
			playthroughId,
			playthroughData?.passagesRef
		)
	}

	static get collection() {
		return 'playthroughs'
	}
}
