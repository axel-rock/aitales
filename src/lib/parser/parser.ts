import { HTMLParser } from './types/html'

export class Parser {
	static async getContent(file: File) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.readAsText(file, 'UTF-8')
			reader.onload = (evt) => {
				resolve(evt.target.result)
			}
			reader.onerror = (evt) => {
				reject({
					error: evt.target.error,
					message: 'error reading file'
				})
			}
		})
	}

	static async parse(file: File) {
		let parser: Parser
		switch (file.type) {
			case 'text/html':
				parser = new HTMLParser()
				break
			default:
				throw new Error('Unsupported file type')
				break
		}

		return parser.parse(file)
	}
}
