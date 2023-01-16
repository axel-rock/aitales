import { Parser } from '../parser'

const selector = '#content'

export class HTMLParser {
	async parse(file: File) {
		const html = await Parser.getContent(file)
		const parser = new DOMParser()
		const doc = parser.parseFromString(html, 'text/html')
		const content = [...doc.querySelectorAll(selector)].map((el) => el.textContent)

		return content
	}
}
