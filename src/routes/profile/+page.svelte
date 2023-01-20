<script lang="ts">
	import type { PageData } from './$types'
	import { signOut } from '$lib/stores/auth'

	export let data: PageData
</script>

<h1>{data.user?.name}</h1>
<p>{data.user?.email}</p>

<a href="/" on:click={signOut} class="button">Logout</a>
