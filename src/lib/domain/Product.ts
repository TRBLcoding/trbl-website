import type { Database } from "$lib/supabase/database.types"
import { createSupabaseStorageUrl } from "$lib/supabase/supabaseClient"
import { ProductAmount, type ProductAmountJSON } from "./ProductAmount"

export type Category = Database['public']['Enums']['Category']
export const CATEGORY_VALUES: readonly Category[] = ["Sound", "Light", "Truss", "Media"] as const

export type Type = Database['public']['Enums']['Type']
export const TYPE_VALUES: readonly Type[] = ["Mixer", "Microphone", "Speaker", "SoundSet", "LightEffect", "LightSet", "Truss", "Network", "UPS", "Scherm", "Controls"] as const

// The ProductJSON as specified in the database
export type DBProductJSON = Database['public']['Tables']['products']['Row']
// The ProductJSON received by the client includes joined member_of field
export type ProductJSON = DBProductJSON & { member_of: ProductAmountJSON[] }

/**
 * Domain class representing a product. Is base class of ProductGroup.
 * 
 * Saved in the products table.
 */
export class Product {
	public searchableString = ""

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
		public memberOf: ProductAmount[]
	) {
		this.updateSearchableString()
	}

	updateSearchableString() {
		this.searchableString = `${this.name} ${this.categories.join(" ")} ${this.type}`.toLowerCase()
	}

	/**
	 * Checks if product matches a search string(case insensitive)
	 * - if searchString is undefined, matches all
	 */
	matchesSearchString(searchString: string) {
		if (!searchString) return true
		return !searchString
			.toLowerCase()
			.split(" ")
			.map((keyword) => this.searchableString.includes(keyword))
			.includes(false)
	}

	/** Returns max amount or Infinity when maxOrderAmount is null  */
	getMaxOrderAmount() {
		if (this.maxOrderAmount === null) return Infinity
		return this.maxOrderAmount
	}

	toJSON() {
		return {
			name: this.name,
			price: this.price,
			description: this.description,
			categories: this.categories,
			type: this.type,
			visible: this.visible,
			image_ids: this.imageIds,
			max_order_amount: this.maxOrderAmount,
		} as DBProductJSON
	}
	/**
	 * Must be async to match signature of ProductGroup.fromJSON
	 */
	static async fromJSON(json: ProductJSON) {
		return new Product(
			json.id,
			json.name,
			json.price,
			json.description,
			json.categories,
			json.type,
			json.visible,
			json.image_ids || [],
			json.max_order_amount || null,
			json.member_of.map(ProductAmount.fromJSON)
		)
	}

	static imageToUrl(imageId: string) {
		return createSupabaseStorageUrl("PublicImages", "product-images/", imageId)
	}
	static imageToThumbnailUrl(imageId: string) {
		return createSupabaseStorageUrl("PublicImages", "product-images/thumbnails/", imageId)
	}

	getImageUrls() {
		return this.imageIds.map(e => e.startsWith("data:") ? e : Product.imageToUrl(e))
	}
	getThumbnailUrls() {
		return this.imageIds.map(e => e.startsWith("data:") ? e : Product.imageToThumbnailUrl(e))
	}

	createCarouselImages() {
		if (!this.imageIds) return []
		return this.imageIds.map(async (e) => {
			return {
				name: "name",
				imageUrl: e.startsWith("data:") ? e : Product.imageToUrl(e),
				thumbnailUrl: e.startsWith("data:") ? e : Product.imageToThumbnailUrl(e)
			}
		})
	}
}
