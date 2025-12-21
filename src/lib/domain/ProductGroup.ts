import { Product, type Category, type Type } from "./Product"
import { ProductAmount, type ProductAmountJSON } from "./ProductAmount"

export type ProductGroupJSON = {
	id: number
	name: string
	price: number
	description: string
	categories: Category[]
	type: Type
	visible: boolean
	imageIds: string[]
	maxOrderAmount: number | null
	member_of: ProductAmountJSON[]
	contained_products: ProductAmountJSON[]
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
		public imageIds: string[],
		public maxOrderAmount: number | null,
		public memberOf: ProductAmount[],
		public containedProducts: ProductAmount[],
	) {
		super(id, name, price, description, categories, type, visible, imageIds, maxOrderAmount, memberOf)
	}

	static async fromJSON(json: ProductGroupJSON) {
		return new ProductGroup(
			json.id,
			json.name,
			json.price,
			json.description,
			json.categories,
			json.type,
			json.visible,
			json.imageIds,
			json.maxOrderAmount,
			json.member_of.map(ProductAmount.fromJSON),
			await Promise.all(json.contained_products.map(ProductAmount.fromJSON)),
		)
	}
}