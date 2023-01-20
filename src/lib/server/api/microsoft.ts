import { PRIVATE_SPEECH_KEY, PRIVATE_SPEECH_REGION } from '$env/static/private'
import { SpeechConfig, SpeechSynthesizer } from 'microsoft-cognitiveservices-speech-sdk'
import { uploadString, uploadBytes } from '$lib/firebase/storage'

const voices = [
	{ lang: 'en', gender: 'male', name: 'Davis', id: 'en-US-DavisNeural' },
	{ lang: 'en', gender: 'female', name: 'Aria', id: 'en-US-AriaNeural' },
	{ lang: 'fr', gender: 'female', name: 'Denise', id: 'fr-FR-DeniseNeural' },
	{ lang: 'fr', gender: 'male', name: 'Jerome', id: 'fr-FR-JeromeNeural' }
]

export class SpeechSynthesis {
	text: string
	lang = 'en'
	path: string
	voice: any

	constructor({ text, lang, path }: any) {
		this.text = text
		// this.text = 'hello'
		this.lang = lang || this.lang
		this.path = path
		this.voice = voices.find((voice) => voice.lang === this.lang)
	}

	async synthesize() {
		return new Promise(async (resolve, reject) => {
			// try {
			// 	const t = await uploadString(this.path + '.txt', 'HelloWorld')
			// 	resolve(t)
			// } catch (e) {
			// 	console.error(e)
			// }
			const speechConfig = SpeechConfig.fromSubscription(PRIVATE_SPEECH_KEY, PRIVATE_SPEECH_REGION)
			speechConfig.speechSynthesisVoiceName = this.voice.id
			const synthesizer = new SpeechSynthesizer(speechConfig)
			synthesizer.speakTextAsync(
				this.text,
				(result) => {
					synthesizer.close()
					resolve(uploadBytes(this.path + '.' + SpeechSynthesis.format, result.audioData))
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
}
