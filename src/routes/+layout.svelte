<script lang="ts">
	import type { LayoutData } from './$types'
	import { page } from '$app/stores'
	import Logo from '$lib/components/Logo.svelte'
	import { signIn } from '$lib/stores/auth'
	import { afterNavigate } from '$app/navigation'

	export let title = 'Ai Tales'
	export let data: LayoutData
	let { user, access } = data

	afterNavigate(() => {
		const checkbox = document.querySelector('input[type="checkbox"]')
		if (checkbox) checkbox.checked = false
	})
</script>

<header>
	<Logo {title} />

	<input type="checkbox" />
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="icon icon-tabler icon-tabler-menu-2"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		stroke-width="2"
		stroke="currentColor"
		fill="none"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path stroke="none" d="M0 0h24v24H0z" fill="none" />
		<line x1="4" y1="6" x2="20" y2="6" />
		<line x1="4" y1="12" x2="20" y2="12" />
		<line x1="4" y1="18" x2="20" y2="18" />
	</svg>

	<nav>
		{#if user}
			<a href="/stories" class:active={$page.url.pathname === '/stories'}>Stories</a>
		{/if}
		{#if access?.admin}
			<a href="/admin" class:active={$page.url.pathname === '/admin'}>Admin</a>
			<a href="/datasets" class:active={$page.url.pathname === '/datasets'}>Datasets</a>
		{/if}
		{#if user}
			<a href="/profile" class="button outline">{user?.displayName}</a>
		{:else}
			<a style="cursor: pointer" on:click={signIn}>Login</a>
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

<style global>
	@import '../css/app.css';
</style>
