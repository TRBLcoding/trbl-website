import { Product } from "./Product"
import { ProductAmount, type ProductAmountJSON } from "./ProductAmount"
export type ProductGroupJSON = {
	id: number
	name: string
	price: number
	description: string
	product_group_product_amounts: ProductAmountJSON[]
	max_order_amount: number | null
}

export class ProductGroup {
	constructor(
		public id: number,
		public name: string,
		public price: number,
		public description: string,
		public productAmounts: ProductAmount[],
		public maxOrderAmount: number | null,
	) { }

	static async fromJSON(json: ProductGroupJSON) {
		return new ProductGroup(
			json.id,
			json.name,
			json.price,
			json.description,
			await Promise.all(json.product_group_product_amounts.map(ProductAmount.fromJSON)),
			json.max_order_amount,
		)
	}
}