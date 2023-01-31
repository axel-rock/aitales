<svelte:options accessors />

<script lang="ts">
	import { Passage } from '$lib/stories/passage'
	import { enhance } from '$app/forms'
	import type { Playthrough } from '$lib/stories/playthrough'
	import type { Story } from '$lib/stories/story'
	export let passage: Passage
	export let playthrough: Playthrough
	export let story: Story
	export let isLast: boolean
	export let shadowText: HTMLelement
	export let container: HTMLElement

	export function scrollIntoView() {
		container.scrollIntoView({ behavior: 'smooth' })
	}
</script>

<section bind:this={container} class={passage.type}>
	<p class:isLast>{Passage.cleanText(passage.text)}</p>
	<p bind:this={shadowText} class="shadow" />

	{#if isLast}
		{#if passage.tags?.includes('prompt')}
			<form method="POST" action="?/prompt" class="prompt" use:enhance>
				<!-- <label for="input">What do you want to do?</label> -->
				<input
					type="text"
					id="input"
					name="input"
					placeholder="What do you want to do?"
					required
					autocomplete="off"
				/>
				<input type="hidden" name="playthroughId" value={playthrough?.id} />
				<input type="hidden" name="storyId" value={story.id} />
				<input type="hidden" name="lastPassageText" value={passage.text} />
				<input type="hidden" name="lastPassageId" value={passage.id} />
				<button type="submit">Go</button>
			</form>
		{:else if passage.links}
			<nav class="center">
				{#each passage.links as link}
					<form method="POST" action="?/continue" use:enhance>
						<input type="hidden" name="storyId" value={story?.id} />
						<input type="hidden" name="playthroughId" value={playthrough?.id} />
						<input type="hidden" name="nextPassageId" value={link.pid} />
						<button type="submit">{link.name}</button>
					</form>
				{/each}
			</nav>
		{/if}

		{#if passage.type === 'input'}
			<nav class="center">Generating story…</nav>
		{/if}
	{/if}
</section>

<style>
	p:not(.isLast) {
		opacity: 0.5;
	}

	.is-playing p {
		opacity: 0.1;
	}

	p {
		white-space: pre-wrap;
	}

	p.shadow {
		position: absolute;
		opacity: 0.8;
	}

	form.prompt {
		display: grid;
		grid-template-columns: 1fr auto;
	}
</style>
