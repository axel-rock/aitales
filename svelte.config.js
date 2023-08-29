// import firebase from 'svelte-adapter-firebase'
import { vitePreprocess } from '@sveltejs/kit/vite'
import adapter from '@sveltejs/adapter-auto'

const config = {
	preprocess: [vitePreprocess()],

	kit: {
		// adapter: adapter()
		adapter: adapter(),
	}
}

export default config
