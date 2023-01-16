// import type { Actions } from './$types'
// import { Parser } from '$lib/parser/parser'

// export const actions: Actions = {
// 	preview: async ({ cookies, request }) => {
// 		console.log(cookies)
// 		const data = await request.formData()
// 		const file = data.get('file') as File

// 		const chunks = await Parser.parse(file)
// 		console.log(chunks)

// 		return { success: true }
// 	}
// }
