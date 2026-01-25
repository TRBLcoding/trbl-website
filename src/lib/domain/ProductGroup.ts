import { Product, type Category, type ProductJSON, type Type } from "./Product"
import { ProductAmount, type ProductAmountJSON } from "./ProductAmount"

// The ProductGroupJSON received by the client includes joined contained_products field
export type ProductGroupJSON = ProductJSON & { contained_products: ProductAmountJSON[] }

/**
 * Domain class representing a product group. Inherits from Product and adds contained products (as ProductAmounts).
 * 
 * Saved in the products table.
 */
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
			json.image_ids,
			json.max_order_amount,
			json.member_of.map(ProductAmount.fromJSON),
			await Promise.all(json.contained_products.map(ProductAmount.fromJSON)),
		)
	}
}