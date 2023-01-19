<script lang="ts">
	import type { PageData } from './$types'
	import { enhance } from '$app/forms'
	import { Passage } from '$lib/stories/passage'
	import { Story } from '$lib/stories/story'

	export let data: PageData

	let { story } = data
	let { passages } = story

	let json: string = ''

	export const isValidJson = (text: string) => {
		try {
			JSON.parse(text)
			return true
		} catch (e) {
			return false
		}
	}
</script>

<h1>{story.title}</h1>

<div>
	<form method="POST" action="?/jsonToPassages" use:enhance>
		<label for="json">Paste your JSON file here</label>
		<textarea name="json" bind:value={json} rows="10" />
		<input type="hidden" name="storyId" value={story?.id} />
		<button type="submit" disabled={!isValidJson(json)}>Save</button>
	</form>
</div>

{#await passages}
	<span>Loading...</span>
{:then passages}
	{#each passages as passage}
		<div id="passage-{passage.pid}" class="surface">
			<p>{passage.text}</p>
			{#if passage.links}
				<nav>
					{#each passage.links as link}
						<a href="#passage-{link.pid}">{link.name}</a>
					{/each}
				</nav>
			{/if}

			{#if passage.audio}
				{#await passage.audio}
					<p>waiting for the promise to resolve...</p>
				{:then audio}
					<audio src={audio} controls />
				{:catch error}
					<p>Something went wrong: {error.message}</p>
				{/await}
			{:else}
				<form method="POST" action="?/generateAudio" use:enhance>
					<input
						type="hidden"
						name="path"
						value={[Story.collection, story.id, story.lang, passage.pid].join('/')}
					/>
					<input
						type="hidden"
						name="ref"
						value={[Story.collection, story.id, Passage.collection, passage.pid].join('/')}
					/>
					<input type="hidden" name="lang" value={story.lang} />
					<input type="hidden" name="text" value={passage.text} />
					<!-- <input type="hidden" name="user" value={$currentUser?.uid} /> -->
					<input type="submit" value="Generate audio" />
				</form>
			{/if}
		</div>
	{/each}

	{#if passages?.length <= 0}
		<p>No passages yet.</p>
	{/if}
{/await}
