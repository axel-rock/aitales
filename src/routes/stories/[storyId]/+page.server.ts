import type { Actions } from './$types'
import { embeddings, completion } from '$lib/server/api/openai'
import { query } from '$lib/server/api/pinecone'
import { firestore } from '$lib/firebase/admin'

export const actions: Actions = {
	prompt: async ({ cookies, request }) => {
		const data = await request.formData()

		const lastPassageId = data.get('lastPassageId')
		const storyId = data.get('storyId')
		const prompt = data.get('prompt')
		const vector = await embeddings(prompt)

		let lastPassage = await firestore.doc(`stories/${storyId}/passages/${lastPassageId}`).get()
		lastPassage = lastPassage.data()

		const outcome = await getClosestOutcome({ vector, lastPassage, storyId })

		const lastPassageText = data.get('lastPassageText')

		let context = await query(vector)
		console.log(context)
		context = context.matches.map((entry) => entry.metadata.text)

		const _prompt = improvisePrompt({ lastPassageText, context, prompt, outcome })

		// Je sors un sandwich et j'attaque

		const output = await completion({ prompt: _prompt })

		// console.log(results)

		// console.log(prompt, embedding)

		console.log(output.choices[0].text)

		return {
			success: true,
			text: output.choices[0].text
		}
	}
}

function improvisePrompt({ lastPassageText, context, prompt, outcome }) {
	return `[We are in a text based RPG. You are the GM. I am the hero. Don't ask questions. Speak with a storyteller tone, in the same language as me. Bridge the gap]
	Possible context: "${context[0]}"
	Last chapter: "${lastPassageText}"
	Next chapter: "${outcome.text}"
	Here is what I want to do: "${prompt}"
	What happens between Last Chapter and Next chapter?`
}

async function getClosestOutcome({ vector, lastPassage, storyId }) {
	const possibleOutcomes = await firestore
		.collection(`stories/${storyId}/passages/`)
		.where(
			'id',
			'in',
			lastPassage?.links.map((link) => link.pid)
		)
		.get()
	return possibleOutcomes.docs
		.map((doc) => doc.data())
		.map((passage) => {
			return { ...passage, similarity: cosineSimilarity(passage.vector, vector) }
		})
		.sort((a, b) => b.similarity - a.similarity)[0]
}

function dotProduct(vecA, vecB) {
	let product = 0
	for (let i = 0; i < vecA.length; i++) {
		product += vecA[i] * vecB[i]
	}
	return product
}

function magnitude(vec) {
	let sum = 0
	for (let i = 0; i < vec.length; i++) {
		sum += vec[i] * vec[i]
	}
	return Math.sqrt(sum)
}

function cosineSimilarity(vecA, vecB) {
	return dotProduct(vecA, vecB) / (magnitude(vecA) * magnitude(vecB))
}
