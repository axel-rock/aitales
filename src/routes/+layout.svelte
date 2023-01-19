<script lang="ts">
	import '../css/app.css'
	import type { LayoutData } from './$types'
	import { page } from '$app/stores'
	import Logo from '$lib/components/Logo.svelte'
	import { signOut, signIn } from '$lib/stores/auth'

	export let title = 'Ai Tales'
	export let data: LayoutData
	let { user, access } = data
</script>

<header>
	<Logo {title} />

	<nav>
		<a href="/stories" class:active={$page.url.pathname === '/stories'}>Stories</a>
		{#if access?.admin}
			<a href="/admin" class:active={$page.url.pathname === '/admin'}>Admin</a>
		{/if}
		<a href="/datasets" class:active={$page.url.pathname === '/datasets'}>Datasets</a>
		{#if user}
			<a href="/" on:click={signOut}>Logout</a>
			<span>{user?.name}</span>
		{:else}
			<a href="/" on:click={signIn}>Login</a>
		{/if}
	</nav>
</header>

<main>
	<slot />
</main>

<footer>
	<span />

	<nav>
		<a href="https://buy.stripe.com/cN214K7nO4ap09O001">Sponsor</a>
		<a href="/credits">Credits</a>
	</nav>
</footer>
