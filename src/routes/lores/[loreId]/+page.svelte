<script lang="ts">
	import type { PageData } from './$types'
	import Dropzone from 'dropzone'
	import 'dropzone/dist/dropzone.css'
	import { onMount } from 'svelte'
	import { Parser } from '$lib/parser/parser'
	import { Chunk } from '$lib/parser/chunk'

	export let data: PageData
	let { lore } = data
	let files = []
	let chunks = []
	let form: HTMLFormElement

	onMount(async () => {
		let dropzone = new Dropzone(form, {
			maxFilesize: 100, //MB
			maxFiles: 3,
			acceptedFiles: '.pdf,.html'
		})

		// const lore = await data.lore

		dropzone.on('processing', async (file: File) => {
			const strings = await Promise.all(
				dropzone.getAcceptedFiles().map((file: File) => Parser.parse(file))
			)
			chunks = strings
			strings.forEach((text: string) => {
				const chunk = new Chunk({ text, source: file })
			})
		})
	})
</script>

<h1>Lore</h1>

{#if lore}
	{lore.id}
{/if}

<ul>
	{#each chunks as chunk}
		<li>
			<details>
				<pre>{chunk}</pre>
			</details>
		</li>
	{/each}
</ul>

<form bind:this={form} action="/" class="dropzone surface overflow-scroll max-h-60" />

<style>
	form {
		width: 100%;
	}

	form.dropzone button {
		display: none;
		color: red;
	}
</style>
