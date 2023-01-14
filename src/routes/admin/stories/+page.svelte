<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData

	console.log(data)
</script>

<h1>Stories</h1>

{#each data.stories as story}
	<a href="/admin/stories/{story.id}">{story.title}</a>
{/each}
