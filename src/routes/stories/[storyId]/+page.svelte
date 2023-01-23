<script lang="ts">
	import type { PageData } from './$types'
	import { enhance } from '$app/forms'
	import { Passage } from '$lib/stories/passage'

	export let data: PageData
	let { story } = data
	let { passages } = data
	let { progress } = story

	$: lastPassage = $progress?.at(-1)

	let src

	progress.subscribe(async (passages) => {
		if (passages.at(-1)) {
			src = await passages.at(-1).audio
		}
	})
</script>

<article>
	<!-- <Heading tag="h1" customSize="text-2xl font-medium">{story.title}</Heading> -->
	<h1>{story.title}</h1>

	{#if $progress.length}
		{#each $progress as passage}
			<p id="passage-{passage.pid}">{passage.text}</p>
		{/each}
	{:else}
		<span>Loading...</span>
	{/if}
</article>

{#if lastPassage.tags?.includes('prompt')}
	<form
		method="POST"
		action="?/prompt"
		use:enhance={({ form, data, action, cancel }) => {
			return async ({ result, update }) => {
				if (result.type === 'success') {
					progress.update((passages) => {
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
		<input type="hidden" name="lastPassageText" value={lastPassage.text} />
		<input type="hidden" name="lastPassageId" value={lastPassage.id} />
		<button type="submit">Go</button>
	</form>
{:else if lastPassage.links}
	<nav class="center">
		{#each lastPassage.links as link}
			<button on:click={story.nextPassage({ id: link.pid })}>{link.name}</button>
		{/each}
	</nav>
{:else}
	<nav class="center">
		<button on:click={story.nextPassage()}>Next</button>
	</nav>
{/if}

<audio {src} controls style="align-self: center;" />

<!-- <Story {story} /> -->
