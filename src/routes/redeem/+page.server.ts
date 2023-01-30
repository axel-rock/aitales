import { firestore, getUserFromSessionCookie } from '$lib/firebase/admin'
import { error } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions = {
	default: async ({ cookies, request }) => {
		const user = await getUserFromSessionCookie(cookies.get('__session') as string)
		const { code } = Object.fromEntries(await request.formData())

		if (!user) throw error(401, 'Please log in to redeem a coupon')

		const couponSnapshot = await firestore
			.collection('coupons')
			.doc(code as string)
			.get()

		if (!couponSnapshot.exists) throw error(404, 'No coupon found')

		const coupon = couponSnapshot.data()

		if (!coupon || coupon.quantity <= 0) throw error(400, 'Coupon is out of stock')

		if (coupon.redeemedBy?.includes(user.uid)) throw error(400, 'Coupon already redeemed')

		await Promise.all([
			firestore.collection('access').doc(user.uid).set(coupon.access, { merge: true }),
			firestore.runTransaction(async (transaction) => {
				const doc = await transaction.get(couponSnapshot.ref)
				const newQuantity = Math.max(doc.data()?.quantity - 1, 0)
				const redeemedBy = doc.data()?.redeemedBy || []
				redeemedBy.push(user.uid)
				transaction.update(couponSnapshot.ref, { quantity: newQuantity, redeemedBy })
			})
		])

		return {
			success: true,
			message: 'Coupon found'
		}
	}
} satisfies Actions
