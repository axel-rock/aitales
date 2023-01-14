import { getDownloadURL } from '$lib/storage'

export class Link {
	name: string
	url: string
	pid: string
}

export class Passage {
	private _text?: string
	links?: Link[]
	private _audio?: string

	constructor({ id, text, links, audio }) {
		this.id = id
		this._text = text
		this.links = links
		this._audio = audio
	}

	static get collection() {
		return 'passages'
	}

	get pid() {
		return this.id
	}

	get text() {
		const regexs = [/\[\[.*?\]\]/g, /\{\{(.*?)\}\}(.*?)\{\{(.*?)\}\}/g]
		return this._text.replaceAll(regexs[0], '') // remove double brackets
		// .replaceAll(regexs[1], '') // remove variables
	}

	get audio() {
		if (this._audio) return getDownloadURL(this._audio)
		return this._audio
	}
}
