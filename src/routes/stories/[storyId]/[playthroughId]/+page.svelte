<script lang="ts">
	import type { PageData } from './$types'
	import { enhance } from '$app/forms'
	import { Passage } from '$lib/stories/passage'
	import { getDownloadURL } from '$lib/firebase/storage'

	export let data: PageData
	let { story, playthrough, passages } = data

	$: lastPassage = $passages?.at(-1)

	let src = null
	let autoplay = false
	autoplay = true

	passages.subscribe(async (passages) => {
		if (
			passages?.length &&
			passages?.at(-1)?.audio &&
			passages?.at(-1)?.type !== 'input' &&
			passages?.at(-1)?.type !== 'completion' &&
			passages?.at(-2)?.type !== 'completion'
		)
			src = await getDownloadURL(passages.at(-1).audio)
		else if (passages?.at(-2)?.audio) src = await getDownloadURL(passages.at(-2).audio)
	})
</script>

<article>
	<!-- <Heading tag="h1" customSize="text-2xl font-medium">{story.title}</Heading> -->
	<h1>{story.title}</h1>

	{#if $passages?.length}
		{#each $passages as passage, index}
			{#if passage.type !== 'prompt' && $passages?.at(index - 1)?.type !== 'completion'}
				<p id="passage-{passage.pid}" class={passage.type}>{Passage.cleanText(passage.text)}</p>
			{/if}
		{/each}
	{:else}
		<span>Loading...</span>
	{/if}

	{#if playthrough}
		<form id="reset" method="POST" action="?/reset" use:enhance>
			<input type="hidden" name="playthroughId" value={playthrough.id} />
			<button type="submit">Reset</button>
		</form>
	{/if}
</article>

{#if lastPassage?.tags?.includes('prompt')}
	<form method="POST" action="?/prompt" use:enhance>
		<!-- <label for="input">What do you want to do?</label> -->
		<input
			type="text"
			id="input"
			name="input"
			placeholder="What do you want to do?"
			autocomplete="off"
		/>
		{#if playthrough?.id}
			<input type="hidden" name="playthroughId" value={playthrough?.id} />
		{/if}
		<input type="hidden" name="storyId" value={story.id} />
		<input type="hidden" name="storyRef" value={story.ref} />
		<input type="hidden" name="lastPassageRef" value={lastPassage.ref.path} />
		<input type="hidden" name="lastPassageText" value={lastPassage.text} />
		<input type="hidden" name="lastPassageId" value={lastPassage.id} />
		<button type="submit">Go</button>
	</form>
{:else if lastPassage?.links}
	<nav class="center">
		{#each lastPassage.links as link}
			<form method="POST" action="?/continue" use:enhance>
				{#if playthrough?.id}
					<input type="hidden" name="playthroughId" value={playthrough?.id} />
				{/if}
				<input type="hidden" name="storyId" value={story.id} />
				<input type="hidden" name="nextPassageId" value={link.pid} />
				<button type="submit">{lastPassage.links.length > 1 ? link.name : 'Continue'}</button>
			</form>
			<!-- <button on:click={story.nextPassage({ id: link.pid })}>{link.name}</button> -->
		{/each}
	</nav>
{:else if lastPassage?.type === 'input'}
	<nav class="center">Generating story…</nav>
{/if}

<audio {src} controls style="align-self: center;" {autoplay} />

<!-- <Story {story} /> -->
<style>
	article {
		position: relative;
	}

	article > p {
		white-space: pre-wrap;
	}

	article > p.input {
		font-weight: 800;
		font-style: italic;
	}

	article > p:hover {
		opacity: 1;
	}

	form#reset {
		position: absolute;
		top: calc(var(--space) * -0.5);
		right: calc(var(--space) * -0.5);
	}
</style>
