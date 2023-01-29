<script lang="ts">
	import { getDownloadURL } from '$lib/firebase/storage'
	import { Passage } from '$lib/stories/passage'
	import { onMount } from 'svelte'
	import type { Readable } from 'svelte/store'

	export let container: HTMLElement
	export let passages: Readable<Passage[] | null>
	export let autoplay: boolean = false

	let index = -1

	$: currentPassage = $passages?.findLast((passage) => passage.audio)
	$: src = currentPassage?.audio?.path ? getDownloadURL(currentPassage.audio.path) : null

	onMount(async () => {
		console.log('ready!')
	})

	function timeupdate(event: Event) {
		const audio = event.target as HTMLAudioElement

		// console.log(currentPassage?.audio?.boundaries)

		const passageElement = container.querySelector(`#passage-${currentPassage?.id}`)
		if (passageElement) {
			const passageText = Passage.cleanText(currentPassage?.text)
			const boundary = findCurrentBoundary(audio.currentTime)
			let sliceAt = boundary?.textOffset + boundary?.wordLength + 1
			let text = passageText.slice(0, sliceAt)
			// Count the amount line breaks in passageText
			let lineBreaks = (text.match(/\n/g) || []).length
			// if (boundary?.type === 'PunctuationBoundary') lineBreaks +- 1
			text = passageText.slice(0, sliceAt - lineBreaks)
			passageElement.innerHTML = text
		}
		// const passage = $passages?.find((passage) => passage.audio?.path === audio.src)
		// if (!passage) return
		// const passageEl = container.querySelector(`#passage-${passage.pid}`)
		// if (!passageEl) return
		// passageEl.classList.toggle('active', audio.currentTime > passage.audio.start)
	}

	function scrollIntoView(event: Event) {
		const passageElement = container.querySelector(`#passage-${currentPassage?.id}`)
		if (!passageElement) return
		passageElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
	}

	function findCurrentBoundary(time: number) {
		time *= 1000 * 1000 * 10
		time += 2500000
		const boundaries = currentPassage?.audio?.boundaries
		if (!boundaries) return null
		return boundaries?.findLast((boundary) => time >= boundary.audioOffset)
	}
</script>

{#await src}
	<span>Loading...</span>
{:then src}
	<audio
		{src}
		controls
		style="align-self: center;"
		{autoplay}
		on:timeupdate={timeupdate}
		on:play={scrollIntoView}
	/>
{/await}
