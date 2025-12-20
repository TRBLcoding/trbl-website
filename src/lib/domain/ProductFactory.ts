import { Product } from './Product'
import { ProductGroup, type ProductGroupJSON } from './ProductGroup'

/**
 * Factory to create Product or ProductGroup instances from JSON.
 * 
 * Necessary to avoid circular dependencies between Product and ProductGroup.
 */
export class ProductFactory {
    static async fromJSON(json: ProductGroupJSON) {
        if (json.product_group_product_amounts && json.product_group_product_amounts.length > 0) {
            console.log("a")
            return await ProductGroup.fromJSON(json)
        }
        return await Product.fromJSON(json)
    }
}