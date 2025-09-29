import type { Product } from '$lib/domain/Product'
import { persisted } from 'svelte-persisted-store'
import { derived } from 'svelte/store'
import { productStore } from './ProductStore'
import { browser } from '$app/environment'

type CartItem = { id: number; amount: number }
type CartProduct = { product: Product | undefined; amount: number }

function createCartStore() {
	// Persists to localStorage
	const innerStore = persisted<CartItem[]>('cart', [])
	const { update } = innerStore

	// Derived store that transforms CartItems to CartProducts
	const subscribe = derived(innerStore, (cartItems) => {
		if (!browser) return []
		console.log(cartItems)
		const a = cartItems.map(async e => ({ product: await productStore.getProductById(e.id), amount: e.amount }))
		console.log(a)
		return a
	}).subscribe

	function load() {
		if (!browser) return
		update((items) => [...items])
	}

	function add(product: Product, amount: number) {
		update((products) => {
			const existingProduct = products.find((p) => p.id === product.id)
			if (existingProduct) {
				existingProduct.amount = Math.min(existingProduct.amount + amount, product.maxOrderAmount || 0)
			} else {
				products.push({ id: product.id, amount })
			}
			return products
		})
	}

	function remove(productToRemove: Product) {
		update((products) => {
			console.log(products)
			console.log("removing product", productToRemove)
			const newProducts = products.filter((e) => e.id !== productToRemove.id)
			console.log(newProducts)
			return newProducts
		})
	}

	return {
		subscribe,
		add,
		remove,
		innerStore,
		load
	}
}

export const cartStore = createCartStore()
