// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { UserRecord } from 'firebase-admin/auth'
import type { User } from 'microsoft-cognitiveservices-speech-sdk'

// and what to do when importing types
declare global {
	declare namespace App {
		// interface Error {}
		interface Locals {
			user: User | UserRecord
			access: Record<string, boolean>
		}
		// interface PageData {}
		// interface Platform {}
	}
}
