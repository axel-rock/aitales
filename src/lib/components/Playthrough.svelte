<script lang="ts">
	import AudioPlayer from '$lib/components/AudioPlayer.svelte'
	import Passage from '$lib/components/Passage.svelte'
	import { enhance } from '$app/forms'
	import type { Passage as PassageType } from '$lib/stories/passage'
	import type { Playthrough } from '$lib/stories/playthrough'
	import type { Story } from '$lib/stories/story'
	import type { Readable } from 'svelte/store'

	export let story: Story
	export let playthrough: Playthrough
	export let passages: Readable<PassageType[] | null>
	export let autoplay: boolean = false

	let root: HTMLElement
	let passagesElements: any[] = []

	passages.subscribe((passages) => {
		if (!passages?.length) return
		setTimeout(() => {
			passagesElements.at(-1)?.scrollIntoView({ behavior: 'smooth' })
		}, 100)
	})
</script>

<article bind:this={root}>
	<h1>{story?.title}</h1>

	{#if $passages?.length}
		{#each $passages as passage, index}
			<Passage
				bind:this={passagesElements[index]}
				{passage}
				{playthrough}
				{story}
				isLast={index === $passages.length - 1}
			/>
		{/each}
	{/if}

	{#if playthrough}
		<form id="reset" method="POST" action="?/reset" use:enhance>
			<input type="hidden" name="playthroughId" value={playthrough.id} />
			<button type="submit">Reset</button>
		</form>
	{/if}
</article>

<AudioPlayer container={root} {passages} {passagesElements} {autoplay} />

<style>
	article {
		position: relative;
	}

	form#reset {
		position: absolute;
		top: calc(var(--space) * -0.5);
		right: calc(var(--space) * -0.5);
	}
</style>
