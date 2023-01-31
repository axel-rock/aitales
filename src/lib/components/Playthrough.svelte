<script lang="ts">
	import AudioPlayer from '$lib/components/AudioPlayer.svelte'
	import { browser } from '$app/environment'
	import Passage from '$lib/components/Passage.svelte'
	import { enhance } from '$app/forms'
	import type { Passage as PassageType } from '$lib/stories/passage'
	import type { Playthrough } from '$lib/stories/playthrough'
	import type { Story } from '$lib/stories/story'
	import type { Readable } from 'svelte/store'

	export let story: Story
	export let playthrough: Playthrough
	export let passages: Readable<PassageType[] | null>
	export let autoplay: boolean = browser
		? window.localStorage.getItem('autoplay') === 'true'
		: false

	let root: HTMLElement
	let passagesElements: any[] = []

	passages.subscribe((passages) => {
		if (!passages?.length) return
		setTimeout(() => {
			passagesElements.at(-1)?.scrollIntoView({ behavior: 'smooth' })
		}, 100)
	})

	function toggleAutoplay() {
		autoplay = !autoplay
		window.localStorage.setItem('autoplay', autoplay ? 'true' : 'false')
	}
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

	<div id="controls">
		{#if autoplay}
			<button on:click={toggleAutoplay}
				><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7.4 8.3"
					><path
						fill="#fff"
						fill-opacity=".8"
						d="M.6 8.3 1 8l5.7-3.3c.4-.2.6-.4.6-.7 0-.2-.2-.4-.6-.6L1.1.2A1 1 0 0 0 .6 0C.2 0 0 .3 0 .7v6.9c0 .4.2.7.6.7Zm.2-1V1l5.5 3v.1L.9 7.4Z"
					/></svg
				>Autoplay enabled</button
			>
		{:else}
			<button on:click={toggleAutoplay}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8.4 8.6"
					><path
						fill="#fff"
						fill-opacity=".8"
						d="M5.2 6.5 4.6 6 1.9 7.5V3.1L1 2.4v5.3c0 .4.3.7.6.7.2 0 .4 0 .6-.2Zm1.7-1 1-.6c.4-.2.5-.4.5-.6 0-.3-.1-.4-.5-.7L2.2.3 1.7.2 3.5 2l3.8 2.2v.1l-1 .6ZM7.3 8a.4.4 0 0 0 .6-.6L.6.1a.4.4 0 0 0-.5 0v.5Z"
					/></svg
				>Autoplay disabled</button
			>
		{/if}

		{#if playthrough}
			<form id="reset" method="POST" action="?/reset" use:enhance>
				<input type="hidden" name="playthroughId" value={playthrough.id} />
				<button type="submit">Reset</button>
			</form>
		{/if}
	</div>
</article>

<AudioPlayer container={root} {passages} {passagesElements} {autoplay} />

<style>
	article {
		position: relative;
	}

	#controls {
		position: absolute;
		top: calc(var(--space) * -0.5);
		right: calc(var(--space) * -0.5);
		display: flex;
		gap: calc(var(--space) * 0.5);
	}
</style>
