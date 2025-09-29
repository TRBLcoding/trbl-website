import type { Product } from '$lib/domain/Product'
import { clamp } from '$lib/utils/Utils'
import { persisted } from 'svelte-persisted-store'

type CartItem = { productId: number; amount: number }

function createCartStore() {
	// Persists to localStorage
	const innerStore = persisted<CartItem[]>('cart', [])
	const { subscribe, update } = innerStore

	function addToCart(product: Product, amount: number) {
		update((products) => {
			const existingProduct = products.find((p) => p.productId === product.id)
			if (existingProduct) {
				existingProduct.amount = Math.min(existingProduct.amount + amount, product.maxOrderAmount || 0)
			} else {
				products.push({ productId: product.id, amount })
			}
			return products
		})
	}

	function removeFromCart(product: Product) {
		console.log('removing from cart', product)
	}

	return {
		subscribe,
		addToCart,
		removeFromCart
	}
}

export const cartStore = createCartStore()
