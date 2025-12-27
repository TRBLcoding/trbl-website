import { productStore } from "$lib/stores/ProductStore"
import type { Database } from "$lib/supabase/database.types"
import type { Product } from "./Product"

export type ProductAmountJSON = {
	product_id: number
	amount: number
}

export class ProductAmount {
	public product: Product | undefined

	constructor(
		public productId: number,
		public amount: number
	) { }

	toJSON(productGroupId: number) {
		return {
			product_group_id: productGroupId,
			product_id: this.productId,
			amount: this.amount,
		} as Database['public']['Tables']['product_group_product_amounts']['Insert']
	}
	static fromJSON(json: ProductAmountJSON) {
		return new ProductAmount(
			json.product_id,
			json.amount
		)
	}

	async getProduct() {
		if (!this.product) this.product = await productStore.getProductById(this.productId)
		return this.product
	}

	getSubtotal() {
		if (!this.product) throw new Error("Product not loaded yet")
		return this.product.price * this.amount
	}
}
