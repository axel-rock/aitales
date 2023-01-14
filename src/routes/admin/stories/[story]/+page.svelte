<script lang="ts">
	import type { PageData, ActionData } from './$types'
	import { enhance } from '$app/forms'
	import { db } from '$lib/firebase'
	import { setDoc, doc } from 'firebase/firestore'
	import { currentUser } from '$lib/auth'
	import { Passage } from '$lib/passage'
	import { Story } from '$lib/story'

	export let data: PageData

	let story = data.story

	let value = ''
	let json: any

	export const transform = () => {
		try {
			json = JSON.parse(value)
			story.passages = json.passages.map((passage) => new Passage(passage))
		} catch (e) {
			json = null
		}
	}

	export const save = () => {
		console.log('save')
		story.passages.forEach(async (passage) => {
			await setDoc(doc(db, 'stories', story.id, 'passages', passage.pid), passage)
		})
	}
</script>

<h2>{story.lang}</h2>
<h1>{story.title}</h1>

{#if story?.passages?.length > 0}
	{#each story.passages as passage}
		<div id="passage-{passage.pid}" class="surface grid gap-4">
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
					<!-- promise is pending -->
					<p>waiting for the promise to resolve...</p>
				{:then audio}
					<!-- promise was fulfilled -->
					<audio src={audio} controls />
				{:catch error}
					<!-- promise was rejected -->
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
					<input type="hidden" name="user" value={$currentUser?.uid} />
					<input type="submit" value="Generate audio" />
				</form>
			{/if}
		</div>
	{/each}
{:else}
	<p>No passages yet.</p>
{/if}

<div class="grid grid-cols-2 grid">
	<form class="self-start">
		<label for="">Paste your JSON file here</label>
		<textarea bind:value rows="10" on:input={transform} />
		{#if story?.passages?.length > 0}
			<button type="button" on:click={save}>Save</button>
		{/if}
	</form>
	<div>
		{#if json}
			<pre>{JSON.stringify(json, null, 2)}</pre>
		{:else}
			<p>Please type a valid JSON</p>
		{/if}
	</div>
</div>
