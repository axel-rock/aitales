import admin from 'firebase-admin'

try {
	admin.initializeApp({
		credential: admin.credential.applicationDefault()
	})
} catch (error) {
	if (!/already exists/u.test(error.message)) {
		console.error('Firebase admin initialization error', error.stack)
	}
}

export default admin
