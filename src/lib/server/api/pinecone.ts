import { PRIVATE_PINECONE_API_KEY } from '$env/static/private'

const environment = 'us-west1-gcp'

export const query = async (vector: number[], limit = 1) => {
	const project = 'open-ai-embeddings-1652e37'

	// console.log(vector)

	try {
		const response = await fetch(`https://${project}.svc.${environment}.pinecone.io/query`, {
			method: 'POST',
			headers: {
				'Api-Key': PRIVATE_PINECONE_API_KEY,
				'Content-Type': 'application/json'
			},
			// body: '{\n    "vector": [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],\n    "topK": 3,\n    "includeValues": true\n  }',
			body: JSON.stringify({
				vector,
				topK: limit,
				includeMetadata: true,
				includeValues: false
			})
		})

		return response.json()
	} catch (e) {
		console.log(e)
	}
}
