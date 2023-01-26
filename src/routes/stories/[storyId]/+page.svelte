<script lang="ts">
	import type { PageData } from './$types'
	import { enhance } from '$app/forms'
	import { Passage } from '$lib/stories/passage'
	import { getDownloadURL } from '$lib/firebase/storage'

	export let data: PageData
	let { story, passages } = data

	$: lastPassage = $passages?.at(-1)

	let src = null
	let autoplay = false
	autoplay = true

	passages.subscribe(async (passages) => {
		if (passages?.length && passages?.at(-1)?.audio)
			src = await getDownloadURL(passages.at(-1).audio)
	})
</script>

<article>
	<h1>{story.title}</h1>

	{#if $passages?.length}
		<p id="passage-{$passages[0].pid}" class={$passages[0].type}>
			{Passage.cleanText($passages[0].text)}
		</p>
	{:else}
		<span>Loading...</span>
	{/if}
</article>

{#if lastPassage?.links}
	<nav class="center">
		{#each lastPassage.links as link}
			<form method="POST" action="?/continue" use:enhance>
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

<style>
	article {
		position: relative;
	}

	article > p {
		white-space: pre-wrap;
	}
</style>
