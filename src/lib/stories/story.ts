import { getDoc, queryCollection } from '$lib/firebase/client'
import { Passage } from '$lib/stories/passage'
import { writable, type Writable } from 'svelte/store'

export class Story {
	id: string
	title: string
	lang: string
	categories?: [string]

	startPassageId: string
	steps: [string]

	passages: Promise<Passage[]>

	progress: Writable<Passage[]>

	constructor(params: any) {
		this.id = params.id
		this.title = params.title
		this.categories = params.categories
		this.lang = params.lang
		this.startPassageId = params.startPassageId || '1'
		this.steps = params.steps || [this.startPassageId]

		this.progress = writable([])

		this.passages = new Promise(async (resolve) => {
			let passages = await queryCollection(`${Story.collection}/${params.id}/${Passage.collection}`)
			passages = passages.map((passage) => new Passage(passage))
			this.progress.set([passages.at(0)])
			resolve(passages)
		})
	}

	static async getFromId(id: string) {
		return new Story(await getDoc(Story.collection, id))
	}

	static get collection() {
		return 'stories'
	}

	async nextPassage({ id }) {
		if (id) this.steps.push(id)

		const passages = await this.passages

		console.log(passages, id)

		this.progress.set(this.steps.map((stepId) => passages.find((passage) => passage.id === stepId)))
		console.log('nextPassage')
	}
}
