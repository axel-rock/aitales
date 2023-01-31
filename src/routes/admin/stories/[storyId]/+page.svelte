<script lang="ts">
	import type { PageData } from './$types'
	import { enhance } from '$app/forms'
	import { Passage } from '$lib/stories/passage'
	import { Story } from '$lib/stories/story'
	import { getDownloadURL } from '$lib/firebase/storage'

	export let data: PageData

	let { story, passages } = data

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
	<legend>
		<p>
			Use <a href="https://github.com/lazerwalker/twison" target="_blank">Twison</a> story format to
			generate the correct output
		</p></legend
	>
	<form method="POST" action="?/jsonToPassages" use:enhance>
		<label for="json">Paste your JSON file here</label>
		<textarea name="json" bind:value={json} rows="10" />
		<input type="hidden" name="storyId" value={story?.id} />
		<button type="submit" disabled={!isValidJson(json)}>Save</button>
	</form>
</div>

{#if $passages?.length}
	<form method="POST" action="?/generateAllAudio">
		<input type="hidden" name="path" value={[Story.collection, story.id, story.lang].join('/')} />
		<input type="hidden" name="ref" value={[Story.collection, story.id].join('/')} />
		<input type="hidden" name="lang" value={story.lang} />
		<button type="submit">Generate All Audio</button>
	</form>

	{#each $passages as passage}
		<div id="passage-{passage.id}" class="surface">
			<p class="passage">{Passage.cleanText(passage.text)}</p>
			{#if passage.links}
				<nav>
					{#each passage.links as link}
						<a href="#passage-{link.pid}">{link.name}</a>
					{/each}
				</nav>
			{/if}

			{#if passage.audio?.path}
				{#await getDownloadURL(passage.audio.path)}
					<p>waiting for the promise to resolve...</p>
				{:then audio}
					<audio src={audio} controls />
				{:catch error}
					<p>Something went wrong: {error.message}</p>
				{/await}
			{/if}
			<form method="POST" action="?/generateAudio" use:enhance>
				<input
					type="hidden"
					name="path"
					value={[Story.collection, story.id, story.lang, passage.name || passage.id].join('/')}
				/>
				<input
					type="hidden"
					name="ref"
					value={[Story.collection, story.id, Passage.collection, passage.id].join('/')}
				/>
				<input type="hidden" name="lang" value={story.lang} />
				<input type="hidden" name="text" value={Passage.cleanText(passage.text)} />
				<!-- <input type="hidden" name="user" value={$currentUser?.uid} /> -->
				<button type="submit">Generate Audio</button>
			</form>
		</div>
	{/each}
{:else}
	<p>No passages yet.</p>
{/if}

<style>
	p.passage {
		white-space: pre-wrap;
	}
</style>
