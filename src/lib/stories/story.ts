import { getDoc, db, queryCollectionAsReadable } from '$lib/firebase/client'
import { Passage } from '$lib/stories/passage'
import type { User } from 'firebase/auth'
import { doc, limit, setDoc } from 'firebase/firestore'
import type { Readable } from 'svelte/store'

export class Story {
	id: string
	ref: string
	title: string
	lang: string
	categories?: [string]

	startPassageId: string

	// passages: Promise<Passage[]>
	// progress: Writable<Passage[]>

	progress: [string]

	passages: Readable<any>

	constructor(params: any, user?: User, numberOfPassages?: number) {
		this.id = params.id
		this.ref = params.ref
		this.title = params.title
		this.categories = params.categories
		this.lang = params.lang
		this.startPassageId = params.startPassageId || '1'

		this.progress = [`${Story.collection}/${this.id}/${Passage.collection}/${this.startPassageId}`]

		this.passages = queryCollectionAsReadable(
			`${Story.collection}/${this.id}/${Passage.collection}`,
			limit(numberOfPassages)
		)
	}

	async getFirstPassage() {
		const passageDoc = await getDoc(
			`${Story.collection}/${this.id}/${Passage.collection}`,
			this.startPassageId
		)
		return new Passage(passageDoc as Passage)
	}

	static async init(baseStory: Story, user: User, numberOfPassages?: number) {
		const story = new Story(baseStory, user, numberOfPassages)
		story.ref = `users/${user.uid}/${Story.collection}/${story.id}`
		// await story.save()

		// this.passages = queryCollectionAsReadable(
		// 	`${Story.collection}/${story.id}/${Passage.collection}`,
		// 	where('id', '==', story.startPassageId),
		// 	limit(1)
		// )

		return story
	}

	static async getFromId(id: string) {
		return new Story(await getDoc(Story.collection, id))
	}

	static get collection() {
		return 'stories'
	}

	async save() {
		return setDoc(doc(db, this.ref), {
			id: this.id,
			title: this.title,
			categories: this.categories,
			lang: this.lang,
			startPassageId: this.startPassageId
		})
	}
}
