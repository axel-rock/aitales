<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData
	let user: User = data.user as User

	import { GoogleAuthProvider, type User, signInWithPopup } from 'firebase/auth'
	import { auth } from '$lib/firebase/client'

	export async function signIn() {
		const credentials = await signInWithPopup(auth, new GoogleAuthProvider())
		const token = await credentials.user?.getIdToken(true)
		await fetch('/auth', {
			method: 'POST',
			body: JSON.stringify({ token })
		})
		document.location.reload()
	}

	export async function signOut() {
		await auth.signOut()
		await fetch('/auth', {
			method: 'DELETE'
		})
		document.location.reload()
	}
</script>

{#if user}
	<h1>{user.displayName}</h1>
	<p>{user.email}</p>

	<a href="/" on:click={signOut} class="button">Logout</a>
{:else}
	<a href="/" on:click={signIn} class="button">Sign in with Google</a>
{/if}
