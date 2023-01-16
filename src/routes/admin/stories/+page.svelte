<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData
</script>

<h1>Stories</h1>

<nav>
	{#each data.stories as story}
		<a href="/admin/stories/{story.id}" class="button">{story.title}</a>
	{/each}
</nav>
