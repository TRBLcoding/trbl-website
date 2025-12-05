import { Product, type Category, type Type } from "./Product"
import { ProductAmount, type ProductAmountJSON } from "./ProductAmount"
export type ProductGroupJSON = {
	id: number
	name: string
	price: number
	description: string
	product_group_product_amounts: ProductAmountJSON[]
	max_order_amount: number | null
}

export class ProductGroup extends Product {
	constructor(
		public id: number,
		public name: string,
		public price: number,
		public description: string,
		public categories: Category[],
		public type: Type,
		public visible: boolean,
		public productAmounts: ProductAmount[],
		public maxOrderAmount: number | null,
	) { 
		super(id, name, price, description, categories, type, visible, [], maxOrderAmount)
	}

	static async fromJSON(json: any) {
		return new ProductGroup(
			json.id,
			json.name,
			json.price,
			json.description,
			[],
			"product_group",
			true,
			await Promise.all(json.product_group_product_amounts.map(ProductAmount.fromJSON)),
			json.max_order_amount,
		)
	}
}