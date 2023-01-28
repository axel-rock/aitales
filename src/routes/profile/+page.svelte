<script lang="ts">
	import type { PageData } from './$types'
	import { signOut } from '$lib/firebase/auth'
	import type { User } from 'firebase/auth'

	export let data: PageData
	let user: User = data.user as User
</script>

<h1>{user?.displayName}</h1>
<p>{user?.email}</p>

<a href="/" on:click={signOut} class="button">Logout</a>
