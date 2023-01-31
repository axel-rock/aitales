<script lang="ts">
	import type { PageData } from './$types'
	import Playthrough from '$lib/components/Playthrough.svelte'

	export let data: PageData
	let { story, passages } = data
</script>

{#if story}
	<Playthrough {story} {passages} />
{/if}
