<script lang="ts">
	import type { PageData, ActionData } from './$types'
	import { enhance } from '$app/forms'
	import { db } from '$lib/firebase'
	import { setDoc, doc } from 'firebase/firestore'
	import { currentUser } from '$lib/auth'

	import Story from '../Story.svelte'

	export let data: PageData

	let story = data.story
</script>

<Story {story} />
