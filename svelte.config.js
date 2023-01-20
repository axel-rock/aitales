import firebase from 'svelte-adapter-firebase'
import { vitePreprocess } from '@sveltejs/kit/vite'

const config = {
	preprocess: [vitePreprocess()],

	kit: {
		// adapter: adapter()
		adapter: firebase({
			target: 'aitales'
			// esbuildBuildOptions(defaultOptions) {
			// 	return {
			// 		...defaultOptions,
			// 		target: 'esm'
			// 	};
			// }
		})
	}
}

export default config
