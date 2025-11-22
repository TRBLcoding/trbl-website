import { productStore } from "$lib/stores/ProductStore"
import type { Product } from "./Product"

export type ProductAmountJSON = {
	product_id: number
	amount: number
}

export class ProductAmount {
	constructor(
		public product: Product,
		public amount: number
	) { }

	static async fromJSON(json: ProductAmountJSON) {
		return new ProductAmount(
			await productStore.getProductById(json.product_id),
			json.amount
		)
	}

	getSubtotal() {
		return this.product.price * this.amount
	}
}
