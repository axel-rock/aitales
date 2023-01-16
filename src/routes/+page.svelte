<script lang="ts">
	import { onMount } from 'svelte'
	import type { PageData } from './$types'
	import Story from './stories/Story.svelte'

	export let data: PageData
</script>

<p class="text-center">
	<a href="/stories" class="button">Explore our stories</a>
</p>
