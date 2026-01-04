import type { Database } from "$lib/supabase/database.types"
import type { Product } from "./Product"

export type ProductAmountJSON = {
	product_id: number
	amount: number
}

/**
 * Domain class representing a product amount relation. Used by 
 * - ProductGroup.containedProducts: to define how many of each product is in the group 
 * - Product.memberOf: to define how many of this product is in different groups
 * 
 * Saved in the product_group_product_amounts table.
 */
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
		if (!this.product) {
			// Dynamic import to avoid circular dependency
			const { productStore } = await import("$lib/stores/ProductStore")
			const product = await productStore.getProductById(this.productId)
			if (!product)
				throw new Error(`Product with ID ${this.productId} not found`)
			this.product = product
		}
		return this.product
	}

	getSubtotal() {
		if (!this.product) throw new Error("Product not loaded yet")
		return this.product.price * this.amount
	}
}
