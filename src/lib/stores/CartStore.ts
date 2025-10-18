import { browser } from '$app/environment'
import type { Product } from '$lib/domain/Product'
import { persisted, type Persisted } from 'svelte-persisted-store'
import { derived, writable } from 'svelte/store'
import { productStore } from './ProductStore'

export type CartItem = { id: number; amount: number }
export type CartProduct = { product: Product; amount: number }

export const cartAddTrigger = writable<number>(0)

function createCartStore() {
	// Persists to localStorage
	const innerStore = persisted<CartItem[] | undefined>('cart', undefined)
	const { update } = innerStore

	// Derived store that transforms CartItems to CartProducts
	const subscribe = derived<Persisted<CartItem[] | undefined>, Promise<CartProduct>[] | undefined>(innerStore, (cartItems) => {
		if (!browser) return undefined
		const cartProducts = cartItems?.map(async e => {
			const product = await productStore.getProductById(e.id)
			if (!product)
				console.warn("Product not found for id", e.id)
			return { product: product, amount: e.amount }
		})
		return cartProducts
	}).subscribe

	function add(product: Product, amount: number) {
		update((products) => {
			const existingProduct = products?.find((p) => p.id === product.id)
			if (existingProduct) {
				const safeAmount = product.maxOrderAmount ? Math.min(existingProduct.amount + amount, product.maxOrderAmount) : existingProduct.amount + amount
				existingProduct.amount = safeAmount
			} else {
				const safeAmount = product.maxOrderAmount ? Math.min(amount, product.maxOrderAmount) : amount;
				(products || []).push({ id: product.id, amount: safeAmount })
			}
			cartAddTrigger.update(n => n + 1)
			return products
		})
	}

	function remove(productToRemove: Product) {
		update((products) => {
			const newProducts = products?.filter((e) => e.id !== productToRemove.id)
			return newProducts
		})
	}

	function clear() {
		update(() => {
			return []
		})
	}

	return {
		subscribe,
		add,
		remove,
		clear
	}
}

export const cartStore = createCartStore()
