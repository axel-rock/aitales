<script lang="ts">
	import type { PageData } from './$types'
	import Playthrough from '$lib/components/Playthrough.svelte'

	export let data: PageData
	let { story, playthrough, passages } = data
</script>

{#if story && playthrough}
	<Playthrough {story} {playthrough} {passages} />
{/if}
