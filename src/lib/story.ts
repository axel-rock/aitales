import { getDoc, queryCollection } from '$lib/firebase'
import { Passage } from '$lib/passage'

export class Story {
	id: string
	title: string
	lang: string
	categories?: [string]

	passages?: Passage[]

	constructor(params: any) {
		this.id = params.id
		this.title = params.title
		this.categories = params.categories
		this.lang = params.lang

		queryCollection(`${Story.collection}/${params.id}/${Passage.collection}`).then((passages) => {
			this.passages = passages.map((passage) => new Passage(passage))
		})
	}

	static async getFromId(id: string) {
		return new Story(await getDoc(Story.collection, id))
	}

	static get collection() {
		return 'stories'
	}
}
