import type { Product } from "./Product"

export type PersistedProductOrder = { id: number; amount: number }

export class ProductOrder {
	constructor(
		public product: Product,
		public amount: number
	) { }

	getSubtotal(): number {
		return this.product.price * this.amount
	}

	static async calculatePrice(productOrders: ProductOrder[] | Promise<ProductOrder>[]) {
		const awaitedProductOrders = await Promise.all(productOrders)
		return awaitedProductOrders.reduce((acc, e) => acc + e.getSubtotal(), 0)
	}
}
