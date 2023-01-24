<script lang="ts">
	import type { PageData } from './$types'
	import { enhance } from '$app/forms'
	import { Passage } from '$lib/stories/passage'
	import { getDownloadURL } from '$lib/firebase/storage'

	export let data: PageData
	let { story, playthrough, passages } = data

	$: lastPassage = $passages?.at(-1)

	let src = null

	passages.subscribe(async (passages) => {
		if (passages?.length && passages?.at(-1)?.audio)
			src = await getDownloadURL(passages.at(-1).audio)
	})
</script>

<article>
	<!-- <Heading tag="h1" customSize="text-2xl font-medium">{story.title}</Heading> -->
	<h1>{story.title}</h1>

	{#if $passages?.length}
		{#each $passages as passage, index}
			{#if playthrough || index < 1}
				<p id="passage-{passage.pid}">{Passage.cleanText(passage.text)}</p>
			{/if}
		{/each}
	{:else}
		<span>Loading...</span>
	{/if}
</article>

{#if lastPassage?.tags?.includes('prompt')}
	<form
		method="POST"
		action="?/prompt"
		use:enhance={({ form, data, action, cancel }) => {
			return async ({ result, update }) => {
				if (result.type === 'success') {
					passages.update((passages) => {
						passages.push(
							new Passage({
								text: result.data.text,
								id: Math.random().toString()
							})
						)
						return passages
					})
				}
			}
		}}
	>
		<!-- <label for="prompt">What do you want to do?</label> -->
		<input
			type="text"
			id="prompt"
			name="prompt"
			placeholder="What do you want to do?"
			autocomplete="off"
		/>
		<input type="hidden" name="storyId" value={story.id} />
		<input type="hidden" name="storyRef" value={story.ref} />
		<input type="hidden" name="lastPassageText" value={lastPassage.text} />
		<input type="hidden" name="lastPassageId" value={lastPassage.id} />
		<button type="submit">Go</button>
	</form>
{:else if lastPassage?.links}
	<nav class="center">
		{#each lastPassage.links as link}
			<form method="POST" action="?/continue">
				{#if playthrough?.id}
					<input type="hidden" name="playthroughId" value={playthrough?.id} />
				{/if}
				<input type="hidden" name="storyId" value={story.id} />
				<input type="hidden" name="nextPassageId" value={link.pid} />
				<button type="submit">{link.name}</button>
			</form>
			<!-- <button on:click={story.nextPassage({ id: link.pid })}>{link.name}</button> -->
		{/each}
	</nav>
{:else}
	<nav class="center">
		<!-- <button on:click={story.nextPassage()}>Next</button> -->
	</nav>
{/if}

<audio {src} controls style="align-self: center;" />

<!-- <Story {story} /> -->
