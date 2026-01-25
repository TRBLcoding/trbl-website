import type { Product } from "./Product"

export type PersistedProductOrder = { id: number; amount: number }

/**
 * Domain class representing an order of a product with a certain amount. Used in invoices and the cart.
 * 
 * Is similar to Product Amount, but is easier to use for local data since it contains the full Product object.
 * 
 * Persisted in local storage.
 */
export class ProductOrder {
	constructor(
		public product: Product,
		public amount: number
	) { }

	getSubtotal() {
		return this.product.price * this.amount
	}

	static async calculatePrice(productOrders: ProductOrder[] | Promise<ProductOrder>[]) {
		const awaitedProductOrders = await Promise.all(productOrders)
		return awaitedProductOrders.reduce((acc, e) => acc + e.getSubtotal(), 0)
	}
}
