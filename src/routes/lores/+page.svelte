<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData

	const { lores } = data
</script>

<h1>Pro</h1>

{#await $lores}
	<span>Loading...</span>
{:then lores}
	<nav>
		{#each lores as lore}
			<a href="/lores/{lore.id}">{lore.name || lore.id}</a>
		{/each}
	</nav>
{/await}
