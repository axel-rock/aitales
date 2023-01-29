import { PRIVATE_SPEECH_KEY, PRIVATE_SPEECH_REGION } from '$env/static/private'
import { SpeechConfig, SpeechSynthesizer } from 'microsoft-cognitiveservices-speech-sdk'
import { getDownloadURL, uploadBytes } from '$lib/firebase/storage'

const voices = [
	{ lang: 'en', gender: 'male', name: 'Davis', id: 'en-US-DavisNeural' },
	{ lang: 'en', gender: 'female', name: 'Aria', id: 'en-US-AriaNeural' },
	{ lang: 'fr', gender: 'female', name: 'Denise', id: 'fr-FR-DeniseNeural' },
	{ lang: 'fr', gender: 'male', name: 'Jerome', id: 'fr-FR-JeromeNeural' }
]

export type SpeechSynthesisResponse = {
	path: string
	boundaries?: any[]
}

export class SpeechSynthesis {
	text: string
	lang = 'en'
	path: string
	voice: any

	constructor({ text, lang, path }: any) {
		this.text = text
		// this.text = 'hello'
		this.lang = lang || this.lang
		this.path = `${path}-${SpeechSynthesis.getHash(this.text)}.${SpeechSynthesis.format}`
		this.voice = voices.find((voice) => voice.lang === this.lang)
	}

	async exists(): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			await getDownloadURL(this.path)
				.then((url) => {
					resolve(true)
				})
				.catch((e) => {
					resolve(false)
				})
		})
	}

	async synthesize(): Promise<SpeechSynthesisResponse> {
		return new Promise(async (resolve, reject) => {
			const speechConfig = SpeechConfig.fromSubscription(PRIVATE_SPEECH_KEY, PRIVATE_SPEECH_REGION)
			speechConfig.speechSynthesisVoiceName = this.voice.id
			const synthesizer = new SpeechSynthesizer(speechConfig)

			const boundaries: any[] = []

			synthesizer.wordBoundary = (s, e) => {
				// console.log('wordBoundary', s, e)
				boundaries.push({
					type: e.boundaryType,
					audioOffset: e.audioOffset,
					duration: e.duration,
					text: e.text,
					textOffset: e.textOffset,
					wordLength: e.wordLength
				})
			}

			synthesizer.speakTextAsync(
				this.text,
				async (result) => {
					synthesizer.close()
					// console.log(result)
					await uploadBytes(this.path, result.audioData)
					resolve({
						path: this.path,
						boundaries
					})
					// resolve(
					// 	bucket
					// 		.file(this.path)
					// 		.save(new Uint8Array(result.audioData))
					// )
				},
				(error) => {
					synthesizer.close()
					reject(error)
				}
			)
		})
	}

	static get format() {
		return 'wav'
	}

	static getHash(text: string) {
		let hash = 0,
			i,
			chr
		if (text.length === 0) return hash
		for (i = 0; i < text.length; i++) {
			chr = text.charCodeAt(i)
			hash = (hash << 5) - hash + chr
			hash |= 0 // Convert to 32bit integer
		}
		return hash
	}
}
