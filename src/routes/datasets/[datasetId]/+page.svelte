<script lang="ts">
	import type { PageData } from './$types'
	export let data: PageData
	const { dataset } = data
</script>

<h1>{dataset.name}</h1>
