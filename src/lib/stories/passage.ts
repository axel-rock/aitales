import { getDownloadURL } from '$lib/firebase/storage'

export class Link {
	name: string
	url: string
	pid: string
}

export class Passage {
	id: string
	text: string
	audio?: string
	links?: Link[]
	tags?: string[]
	vector?: number[]

	constructor({ id, text, links, tags, audio, vector }) {
		this.id = id
		this.links = links
		this.tags = tags
		this.text = text
		this.audio = audio
		this.vector = vector
	}

	static get collection() {
		return 'passages'
	}

	static cleanText(text: string) {
		const regexs = [/\[\[.*?\]\]/g, /\{\{(.*?)\}\}(.*?)\{\{(.*?)\}\}/g]
		return text.replaceAll(regexs[0], '').trim() // remove double brackets
		// .replaceAll(regexs[1], '') // remove variables
	}

	get cleanText() {
		return Passage.cleanText(this.text)
	}

	asObject() {
		return { ...this }
	}
}
