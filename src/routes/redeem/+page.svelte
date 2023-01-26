<script lang="ts">
	import { page } from '$app/stores'
	import { enhance } from '$app/forms'
	import type { PageData } from './$types'
	import { error } from '@sveltejs/kit'

	export let data: PageData

	let infos: any

	$: code = $page.url.searchParams.get('code')
</script>

<h1>Redeem</h1>

<form
	method="POST"
	use:enhance={({ form, data, action, cancel }) => {
		// `form` is the `<form>` element
		// `data` is its `FormData` object
		// `action` is the URL to which the form is posted
		// `cancel()` will prevent the submission

		return async ({ result, update }) => {
			infos = result
			console.log(result)
			// `result` is an `ActionResult` object
			// `update` is a function which triggers the logic that would be triggered if this callback wasn't set
		}
	}}
>
	<input type="text" id="code" name="code" placeholder="Enter your code here" value={code} />
	<button type="submit">Redeem</button>
</form>

{#if infos}
	{#if infos.error}
		<p class={infos.type}>{infos.error.message}</p>
	{:else}
		<p class={infos.type}>Success! The code was applied successfully.</p>
	{/if}
{/if}

<style>
	p.success {
		color: green;
	}

	p.error {
		color: red;
	}
</style>
