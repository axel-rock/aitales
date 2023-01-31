import { getDownloadURL } from '$lib/firebase/storage'
import type { SpeechSynthesisResponse } from '$lib/server/api/microsoft'

export class Link {
	name: string
	url: string
	pid: string
}

export class Passage {
	id: string
	pid?: string
	text: string
	name: string
	audio?: SpeechSynthesisResponse
	links?: Link[]
	tags?: string[]
	vector?: number[]
	timestamp?: any
	type: string

	constructor({ id, pid, text, name, links, tags, audio, vector, timestamp, type }: Passage) {
		this.id = pid || id
		this.text = text
		this.name = name

		this.audio = audio
		this.links = links
		this.tags = tags
		this.vector = vector
		this.timestamp = timestamp
		this.type = type
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

	get asObject() {
		return JSON.parse(JSON.stringify(this))
	}
}
