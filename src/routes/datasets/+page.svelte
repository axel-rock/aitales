<script lang="ts">
	import type { PageData } from './$types'
	import { newRef } from '$lib/firebase/client'

	export let data: PageData

	let ref = newRef('datasets')

	const { datasets } = data
</script>

{#await $datasets}
	<span>Loading...</span>
{:then datasets}
	<nav>
		{#each datasets as dataset}
			<a href="/datasets/{dataset.id}">{dataset.name || dataset.id}</a>
		{/each}
		{#if datasets.length === 0}
			{#await ref then { id }}
				<p>No datasets yet.</p>
				<a href="/datasets/{id}">
					<span>Create your first Dataset</span>
				</a>
			{/await}
		{/if}
	</nav>
{/await}
