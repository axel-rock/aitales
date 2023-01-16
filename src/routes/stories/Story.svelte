<script>
	import { Story } from '$lib/story'
	import { Passage } from '$lib/passage'
	import { enhance } from '$app/forms'

	export let story

	let progress = story.progression
	let lastPassage = null

	let src

	progress.subscribe(async (passages) => {
		if (passages.length > 0) {
			lastPassage = passages[passages.length - 1]
			if (lastPassage.audio) src = await lastPassage.audio
		}
	})
</script>

<article>
	<hgroup class="text-center">
		<h2>{story.categories.join(' - ')}</h2>
		<h1>{story.title}</h1>
	</hgroup>

	{#each $progress as passage}
		<div id="passage-{passage.pid}">
			<p>{passage.text}</p>
		</div>
	{/each}

	{#if lastPassage?.tags?.includes('prompt')}
		<form
			method="POST"
			action="?/prompt"
			use:enhance={({ form, data, action, cancel }) => {
				// `form` is the `<form>` element
				// `data` is its `FormData` object
				// `action` is the URL to which the form is posted
				// `cancel()` will prevent the submission

				return async ({ result, update }) => {
					console.log(result)
					console.log(update)

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
					// `result` is an `ActionResult` object
					// `update` is a function which triggers the logic that would be triggered if this callback wasn't set
				}
			}}
		>
			<!-- <label for="prompt">What do you want to do?</label> -->
			<input type="hidden" name="context" value={lastPassage.text} />
			<input
				type="text"
				id="prompt"
				name="prompt"
				placeholder="What do you want to do?"
				autocomplete="off"
			/>
			<button type="submit">Submit</button>
		</form>
	{/if}
	{#if lastPassage?.links}
		<nav>
			{#each lastPassage.links as link}
				<button on:click={story.nextPassage({ id: link.pid })}>{link.name}</button>
			{/each}
		</nav>
	{:else}
		<!-- <button on:click={story.nextPassage()}>Next</button> -->
	{/if}

	<audio {src} controls />
</article>
