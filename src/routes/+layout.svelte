<script lang="ts">
	import type { LayoutData } from './$types'
	import { page } from '$app/stores'
	import Logo from '$lib/components/Logo.svelte'
	import { signIn } from '$lib/firebase/auth'
	import { afterNavigate } from '$app/navigation'

	export let title = 'Ai Tales'
	export let data: LayoutData
	let { user, access } = data

	afterNavigate(() => {
		const checkbox = document.querySelector('input[type="checkbox"]')
		if (checkbox) checkbox.checked = false
	})
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

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
			<!-- <a href="/datasets" class:active={$page.url.pathname === '/datasets'}>Datasets</a> -->
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
		<a href="https://buy.stripe.com/cN214K7nO4ap09O001" target="_blank">Sponsor</a>
		<a href="/credits">Credits</a>
		<a href="https://twitter.com/aitalesapp" target="_blank">
			<svg
				fill="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				viewBox="0 0 24 24"
				width="1.25em"
				height="1.25em"
				><path
					d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
				/></svg
			></a
		>
	</nav>
</footer>

<style global>
	@import '../css/app.css';
</style>
