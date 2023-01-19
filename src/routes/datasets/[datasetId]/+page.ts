import type { PageLoad } from './$types'
import { getDoc } from '$lib/firebase/client'
import { Dataset } from '$lib/datasets/dataset'

export const ssr = false

export const load: PageLoad = async ({ params }) => {
	try {
		const dataset = await getDoc('datasets', params.datasetId)
		return {
			dataset: new Dataset(dataset)
		}
	} catch (e) {
		return {
			dataset: new Dataset({ id: params.datasetId })
		}
	}
}
