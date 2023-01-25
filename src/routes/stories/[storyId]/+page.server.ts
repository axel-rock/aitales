import type { Actions } from './$types'
import { embeddings, completion } from '$lib/server/api/openai'
import { query } from '$lib/server/api/pinecone'
import { firestore, getUserFromCookieToken } from '$lib/firebase/admin'
import { Playthrough } from '$lib/stories/playthrough'
import type { User } from 'firebase/auth'
import type { Passage } from '$lib/stories/passage'

export const actions: Actions = {
	continue: async ({ cookies, request }) => {
		const user = await getUserFromCookieToken(cookies.get('token') as string)

		const { storyId, nextPassageId, playthroughId } = Object.fromEntries(await request.formData())

		let playthrough: Playthrough

		if (!playthroughId) {
			playthrough = await Playthrough.fromStoryIdAndUser(storyId as string, user as User)
		} else {
			playthrough = await Playthrough.getFromId(playthroughId as string)
		}

		console.log('continue')

		playthrough.addPassageId(nextPassageId as string)
		await playthrough.save()

		return {
			success: true
		}
	},

	prompt: async ({ cookies, request }) => {
		const { playthroughId, lastPassageId, lastPassageRef, lastPassageText, storyId, input } =
			Object.fromEntries(await request.formData())

		let playthrough: Playthrough
		if (!playthroughId) {
			playthrough = await Playthrough.fromStoryIdAndUser(storyId as string, user as User)
		} else {
			playthrough = await Playthrough.getFromId(playthroughId as string)
		}

		// await playthrough.addPassageFromRef(lastPassageRef as string)

		await playthrough.addInput(input as string)

		const vector = await embeddings(input as string)

		let lastPassage = await firestore.doc(`stories/${storyId}/passages/${lastPassageId}`).get()
		lastPassage = lastPassage.data()

		const outcome = await getClosestOutcome({ vector, lastPassage, storyId })

		let context = await query(vector)
		context = context.matches.map((entry) => entry.metadata.text)

		const prompt = improvisePrompt({ lastPassageText, context, input, outcome })

		// await playthrough.addPrompt(prompt)

		const output = await completion({ prompt: prompt })

		await playthrough.addCompletion(output.choices[0].text)

		await playthrough.addPassageFromRef(outcome.ref.path)

		return {
			success: true,
			text: output.choices[0].text
		}
	},

	reset: async ({ cookies, request }) => {
		const data = await request.formData()
		const playthroughId = data.get('playthroughId')
		const playthrough = await Playthrough.getFromId(playthroughId as string)

		await playthrough.reset()

		return {
			success: true
		}
	}
}

function improvisePrompt({
	lastPassageText,
	context,
	input,
	outcome
}: {
	lastPassageText: string
	context: string[]
	input: string
	outcome: Passage
}) {
	return `[We are in a text based RPG. You are the GM. I am the hero. Don't ask questions. Speak with a storyteller tone, in the same language as me. Bridge the gap]
	Possible context: "${context[0]}"
	Last chapter: "${lastPassageText}"
	Next chapter: "${outcome.text}"
	Here is what I want to do: "${input}"
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
		.map((doc) => {
			return { id: doc.id, ref: doc.ref, ...doc.data() }
		})
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
