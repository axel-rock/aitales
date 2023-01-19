import { getDownloadURL } from '$lib/storage'

export class Link {
	name: string
	url: string
	pid: string
}

export class Passage {
	private _text?: string
	private _audio?: string
	links?: Link[]
	tags?: string[]
	vector?: number[]

	constructor({ id, pid, text, links, tags, audio, vector }) {
		this.id = id || pid
		this.links = links
		this.tags = tags
		this._text = text
		this._audio = audio
		this.vector = vector
	}

	static get collection() {
		return 'passages'
	}

	get pid() {
		return this.id
	}

	get text() {
		const regexs = [/\[\[.*?\]\]/g, /\{\{(.*?)\}\}(.*?)\{\{(.*?)\}\}/g]
		return this._text.replaceAll(regexs[0], '').trim() // remove double brackets
		// .replaceAll(regexs[1], '') // remove variables
	}

	get audio() {
		if (this._audio) return getDownloadURL(this._audio)
		return this._audio
	}

	asObject() {
		return Object.fromEntries(
			Object.entries({
				id: this.id,
				text: this._text,
				links: this.links,
				tags: this.tags,
				audio: this._audio,
				vector: this.vector
			}).filter(([_, v]) => v != null)
		)
	}
}
