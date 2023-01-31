<script lang="ts">
	import { getDownloadURL } from '$lib/firebase/storage'
	import type { Boundary } from '$lib/server/api/microsoft'
	import { Passage as PassageType } from '$lib/stories/passage'
	import type Passage from '$lib/components/Passage.svelte'
	import type { Readable } from 'svelte/store'

	export let container: HTMLElement
	export let passages: Readable<PassageType[] | null>
	export let passagesElements: Passage[]
	export let autoplay: boolean = true

	$: currentPassage = $passages?.findLast((passage: PassageType) => passage.audio)
	$: currentPassageElement = passagesElements?.find(
		(passageElement) => passageElement?.passage?.id === currentPassage?.id
	)
	$: src = currentPassage?.audio?.path ? getDownloadURL(currentPassage.audio.path) : null

	function ontimeupdate(event: Event) {
		const audio = event.target as HTMLAudioElement
		if (currentPassageElement) {
			currentPassageElement.container.classList.add('is-playing')
			const passageText = PassageType.cleanText(currentPassage?.text)
			const boundary = findCurrentBoundary(audio.currentTime)
			let sliceAt = boundary?.textOffset + boundary?.wordLength + 1
			let text = passageText.slice(0, sliceAt)
			text = passageText.slice(0, sliceAt)
			currentPassageElement.shadowText.innerHTML = text
		}
	}

	function onpause(event: Event) {
		if (currentPassageElement) {
			currentPassageElement.container.classList.remove('is-playing')
			currentPassageElement.shadowText.innerHTML = ''
		}
	}

	function scrollIntoView(event: Event) {
		const passageElement = container.querySelector(`#passage-${currentPassage?.id}`)
		if (!passageElement) return
		passageElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
	}

	function findCurrentBoundary(time: number) {
		time += 0.25
		const boundaries = currentPassage?.audio?.boundaries
		if (!boundaries) return null
		return boundaries?.findLast((boundary: Boundary) => time >= boundary.audioOffset)
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
		on:timeupdate={ontimeupdate}
		on:pause={onpause}
		on:play={scrollIntoView}
	/>
{/await}
