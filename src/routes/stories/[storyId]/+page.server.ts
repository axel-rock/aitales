import type { Actions } from './$types'
import { embeddings, completion } from '$lib/server/api/openai'
import { query } from '$lib/server/api/pinecone'

export const actions: Actions = {
	prompt: async ({ cookies, request }) => {
		const data = await request.formData()

		const prompt = data.get('prompt')
		const context = data.get('context')

		const vector = await embeddings(prompt)

		const results = await query(vector)

		const _prompt = improvisePrompt({ context, matches: results.matches, prompt })

		const output = await completion({ prompt: _prompt })

		// console.log(results)

		// console.log(prompt, embedding)

		return {
			success: true,
			text: output.choices[0].text
		}
	}
}

function improvisePrompt({ context, matches, prompt }) {
	return `
	[We are in a text based RPG. You are the GM. I am the hero. Speak with a storyteller tone, in the same language as me]

	Last chapter: "${context}"
	
	Possible context: "${matches[0]?.metadata?.context}"

	Here is what I want to do: "${prompt}"

	What happens?
	`
}
