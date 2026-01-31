import { browser } from '$app/environment'
import type { Product } from '$lib/domain/Product'
import { ProductOrder, type PersistedProductOrder } from '$lib/domain/ProductOrder'
import { persisted, type Persisted } from 'svelte-persisted-store'
import { derived, writable } from 'svelte/store'
import { productStore } from './ProductStore'

// Trigger that fires when product is added to cart, used to open cart dropdown
export const cartAddTrigger = writable<number>(0)

function createCartStore() {
	// Persists to localStorage
	const innerStore = persisted<PersistedProductOrder[]>('cart', [])

	// Clean up items with amount=0 on load
	if (browser) {
		innerStore.update((products) => {
			if (!products) return products
			return products.filter((p) => p.amount > 0)
		})
	}

	const { update } = innerStore

	// Derived store that transforms PersistedProductOrders to ProductOrders
	const subscribe = derived<Persisted<PersistedProductOrder[]>, Promise<ProductOrder>[]>(innerStore, (persistedProductOrders) => {
		if (!browser) return []
		const productOrders = (persistedProductOrders || [])
			.flatMap(e => {
				const promise = productStore.getProductById(e.id).then(product => {
					if (!product) {
						console.warn("Product not found for id", e.id)
						return []
					}
					return [new ProductOrder(product, e.amount)]
				})
				return [promise]
			})
		return productOrders.map(p => p.then(items => items[0]))
	}).subscribe

	// Add product to cart, or increase amount if already in cart
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

	// Update product amount in cart
	function set(product: Product, amount: number) {
		update((products) => {
			const existingProduct = products?.find((p) => p.id === product.id)
			if (!existingProduct) throw new Error(`Product with id: "${product.id}" not in cart`)
			const safeAmount = product.maxOrderAmount ? Math.min(amount, product.maxOrderAmount) : amount
			existingProduct.amount = safeAmount
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
		set,
		remove,
		clear
	}
}

export const cartStore = createCartStore()
