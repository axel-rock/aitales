import { PRIVATE_OPENAI_API_KEY } from '$env/static/private'

const method = 'POST'
const headers = {
	Authorization: 'Bearer ' + PRIVATE_OPENAI_API_KEY,
	'Content-Type': 'application/json'
}

export const completion = async ({
	prompt,
	model = 'text-davinci-003',
	temperature = 0.5,
	max_tokens = 1024
}) => {
	const response = await fetch('https://api.openai.com/v1/completions', {
		method,
		headers,
		body: JSON.stringify({
			model,
			prompt,
			max_tokens,
			temperature
		})
	})

	const data = await response.json()

	return data
}

export const embeddings = async (text: string) => {
	const response = await fetch('https://api.openai.com/v1/embeddings', {
		method,
		headers,
		body: JSON.stringify({
			input: text,
			model: 'text-embedding-ada-002'
		})
	})

	const { data } = await response.json()

	return data[0].embedding
}
