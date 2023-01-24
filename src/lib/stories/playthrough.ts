import { firestore } from '$lib/firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'
import type { User } from 'firebase/auth'
import { Passage } from './passage'
import type { Story } from './story'

export class Playthrough {
	id: string
	story: Story
	user: User
	passagesRef: [string]

	constructor(story: Story, user: User, id?: string) {
		this.id = id || firestore.collection(Playthrough.collection).doc().id
		this.story = story
		this.user = user
		this.passagesRef = []
		this.addPassageId(this.story.startPassageId)
	}

	addPassageId(passageId: string) {
		this.passagesRef.push(`${this.story.ref}/${Passage.collection}/${passageId}`)
	}

	save() {
		return firestore.collection(Playthrough.collection).doc(this.id).set({
			storyId: this.story.id,
			userId: this.user.uid,
			passagesRef: this.passagesRef,
			lastUpdated: FieldValue.serverTimestamp()
		})
	}

	static async fromStoryIdAndUser(storyId: string, user: User) {
		const storyDoc = firestore.collection('stories').doc(storyId)
		let story: any = await storyDoc.get()
		story = story.data()
		story = { id: storyDoc.id, ref: storyDoc.path, ...story } as Story
		return new Playthrough(story, user)
	}

	static async getFromId(playthroughId: string) {
		const playthroughDoc = await firestore
			.collection(Playthrough.collection)
			.doc(playthroughId)
			.get()
		return { id: playthroughDoc.id, ...playthroughDoc.data() }
	}

	static get collection() {
		return 'playthroughs'
	}
}
