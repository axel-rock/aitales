import { getDoc, queryCollection } from '$lib/firebase'
import { Passage } from '$lib/passage'
import type { Writable } from 'svelte/store'
import { writable } from 'svelte/store'

export class Story {
	id: string
	title: string
	lang: string
	categories?: [string]

	startPassageId: string
	steps: [string]

	passages?: Passage[]

	progression: Writable<Passage[]> = writable([])

	constructor(params: any) {
		this.id = params.id
		this.title = params.title
		this.categories = params.categories
		this.lang = params.lang
		this.startPassageId = params.startPassageId || '1'
		this.steps = params.steps || [this.startPassageId]

		queryCollection(`${Story.collection}/${params.id}/${Passage.collection}`).then((passages) => {
			this.passages = passages.map((passage) => new Passage(passage))
			this.progression.set(this.passages.filter((passage) => this.steps.includes(passage.id)))
		})
	}

	static async getFromId(id: string) {
		return new Story(await getDoc(Story.collection, id))
	}

	static get collection() {
		return 'stories'
	}

	nextPassage({ id }) {
		if (id) this.steps.push(id)

		this.progression.set(
			this.steps.map((stepId) => this.passages.find((passage) => passage.id === stepId))
		)
		console.log('nextPassage')
	}
}
