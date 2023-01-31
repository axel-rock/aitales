import type { Actions } from './$types'
import { embeddings, completion } from '$lib/server/api/openai'
import { query } from '$lib/server/api/pinecone'
import { firestore, getUserFromSessionCookie } from '$lib/firebase/admin'
import { Playthrough } from '$lib/stories/playthrough'
import type { User } from 'firebase/auth'
import { type Link, Passage } from '$lib/stories/passage'
import { ref } from 'firebase/storage'

interface StringMap {
	[key: string]: string
}

export const actions: Actions = {
	continue: async ({ cookies, request }) => {
		// const user = await getUserFromSessionCookie(cookies.get('__session') as string)
		const { nextPassageId, playthroughId } = Object.fromEntries(await request.formData())

		const playthrough: Playthrough = await Playthrough.getFromId(playthroughId as string)

		await playthrough.addPassageId(nextPassageId as string)

		return {
			success: true
		}
	},

	prompt: async ({ cookies, request }) => {
		const { playthroughId, lastPassageId, lastPassageRef, lastPassageText, storyId, input } =
			Object.fromEntries(await request.formData()) as StringMap

		const playthrough: Playthrough = await Playthrough.getFromId(playthroughId as string)

		await playthrough.addInput(input as string)

		const vectorForOutcome = await embeddings(input as string)
		const vectorForContext = await embeddings([lastPassageText, input].join(' '))

		const lastPassageDoc = await firestore
			.doc(lastPassageRef || `stories/${storyId}/passages/${lastPassageId}`)
			.get()
		const lastPassage = lastPassageDoc.data() as Passage

		const outcome: any = await getClosestOutcome({
			vector: vectorForOutcome,
			lastPassage,
			storyId,
			previousPassages: playthrough.passagesRef
		})
		const temperature = mapNumberFromARangeToAnother(outcome.similarity, 0.66, 1, 1, 0)
		// Do something with outcome.similarity. 1 is perfect match, Bellow 0.8 is not a good match

		let context = await query(vectorForContext, 3)
		context = context.matches.map((entry: any) => entry.metadata.text)

		// console.log(outcome)

		const prompt = improvisePrompt({ lastPassageText, context, input, outcome })

		await playthrough.addPrompt(prompt)

		const output = await completion({ prompt: prompt, temperature })
		const outputText = output.choices[0].text

		await playthrough.createPassageFromRefWithText(outcome.ref.path, outputText)

		// await playthrough.addCompletion(output.choices[0].text)

		// await playthrough.addPassageFromRef(outcome.ref.path)

		return {
			success: true
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
	let prompt = `<instructions>
	We are in a text based RPG.
	You are the Game Master, I am the hero.
	Don't ask questions.
	Speak with a storyteller tone, in the same language as me.
	Bridge the gap between last-chapter and next-chapter.
	Describe what I could see, hear, smell, taste, touch as much as possible.
	Don't give objects or quests.
	If what I want to do is too unlikely, you can make me fail.
	Action should happen on a short amount of time, no ellipses. Just immediate consequences of my action.
	Use context only if needed.</instructions>`
	context.forEach((context) => {
		prompt += `\n\n<context>${context}</context>`
	})
	prompt += `\n\n<last-chapter>${Passage.cleanText(lastPassageText)}</last-chapter>`
	prompt += `\n\n<next-chapter>${Passage.cleanText(outcome.text)}</next-chapter>`
	prompt += `\n\nHere is what I want to do: "${input}"`
	// return `[We are in a text based RPG. You are the GM. I am the hero. Don't ask questions. Speak with a storyteller tone, in the same language as me. Bridge the gap]
	// Possible context: "${context[0]}"
	// Last chapter: "${lastPassageText}"
	// Next chapter: "${outcome.text}"
	// Here is what I want to do: "${input}"
	// What happens between Last Chapter and Next chapter?`
	return prompt
}

async function getClosestOutcome({
	vector,
	lastPassage,
	storyId,
	previousPassages
}: {
	vector: [number]
	lastPassage: Passage
	storyId: string
}) {
	if (!lastPassage?.links) return null
	const possibleOutcomes = lastPassage.links
		// .filter((link) => !previousPassages.includes(link.pid))
		.map((link) => {
			return { ...link, similarity: cosineSimilarity(link.vector, vector) }
		})
		.sort((a, b) => b.similarity - a.similarity)
	const outcome = possibleOutcomes[0]
	const passage = await firestore
		.doc(`stories/${storyId}/passages/${possibleOutcomes[0].pid}`)
		.get()
	return {
		similarity: outcome.similarity,
		id: passage.id,
		ref: passage.ref,
		...(passage.data() as Passage)
	}
	// const possibleOutcomes = await firestore
	// 	.collection(`stories/${storyId}/passages/`)
	// 	.where(
	// 		'id',
	// 		'in',
	// 		lastPassage.links.map((link: Link) => link.pid)
	// 	)
	// 	.get()
	// return possibleOutcomes.docs
	// 	.map((doc) => {
	// 		return { id: doc.id, ref: doc.ref, ...doc.data() } as any
	// 	})
	// 	.map((passage) => {
	// 		return { ...passage, similarity: cosineSimilarity(passage.vector, vector) }
	// 	})
	// 	.sort((a, b) => b.similarity - a.similarity)[0]
}

function dotProduct(vecA: [number], vecB: [number]) {
	let product = 0
	for (let i = 0; i < vecA.length; i++) {
		product += vecA[i] * vecB[i]
	}
	return product
}

function magnitude(vec: [number]) {
	let sum = 0
	for (let i = 0; i < vec.length; i++) {
		sum += vec[i] * vec[i]
	}
	return Math.sqrt(sum)
}

function cosineSimilarity(vecA: [number], vecB: [number]) {
	return dotProduct(vecA, vecB) / (magnitude(vecA) * magnitude(vecB))
}

function mapNumberFromARangeToAnother(
	value: number,
	x1: number,
	y1: number,
	x2: number,
	y2: number
) {
	return ((value - x1) * (y2 - x2)) / (y1 - x1) + x2
}
