import { Product } from './Product'
import { ProductGroup, type ProductGroupJSON } from './ProductGroup'

/**
 * Factory to create Product or ProductGroup instances from JSON.
 * 
 * Necessary to avoid circular dependencies between Product and ProductGroup.
 */
export class ProductFactory {
    static async fromJSON(json: ProductGroupJSON) {
        if (json.contained_products && json.contained_products.length > 0) {
            return await ProductGroup.fromJSON(json)
        }
        return await Product.fromJSON(json)
    }
}