<script lang="ts">
	import type { PageData } from './$types'

	import Story from '../Story.svelte'

	export let data: PageData
</script>

<hgroup class="text-center">
	<small>{data.category}</small>
	<h1>{data.title}</h1>
</hgroup>

<Story story={data} />
