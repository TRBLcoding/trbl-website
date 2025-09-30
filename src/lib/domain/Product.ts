import type { Database } from "$lib/supabase/database.types"
import { createSupabaseStorageUrl } from "$lib/supabase/supabaseClient"

export const CategoryValues = ["Sound", "Light", "Truss", "Media"]
export type Category = typeof CategoryValues[number]

export const TypeValues = ["Mixer", "Microphone", "Speaker", "SoundSet", "LightEffect", "LightSet", "Truss", "Network", "UPS", "Scherm", "Controls"]
export type Type = typeof TypeValues[number]

export class Product {
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
	) { }

	toJSON() {
		return {
			name: this.name,
			price: this.price,
			description: this.description,
			categories: this.categories,
			type: this.type,
			visible: this.visible,
			imageIds: this.imageIds,
			maxOrderAmount: this.maxOrderAmount,
		} as Database['public']['Tables']['products']['Insert']
	}

	static fromJSON(json: any): Product {
		return new Product(
			json.id,
			json.name,
			json.price,
			json.description,
			json.categories,
			json.type,
			json.visible,
			json.imageIds || [],
			json.maxOrderAmount || null,
		)
	}

	static imageToUrl(imageId: string) {
		return createSupabaseStorageUrl("PublicImages", "product-images/", imageId)
	}
	static imageToThumbnailUrl(imageId: string) {
		return createSupabaseStorageUrl("PublicImages", "product-images/thumbnails/", imageId)
	}

	getImageUrls() {
		return this.imageIds.map(Product.imageToUrl)
	}

	getThumbnailUrls() {
		return this.imageIds.map(Product.imageToThumbnailUrl)
	}

	createCarouselImages() {
		if (!this.imageIds) return []
		return this.imageIds.map(async (e) => {
			return {
				name: "name",
				imageUrl: Product.imageToUrl(e),
				thumbnailUrl: Product.imageToThumbnailUrl(e)
			}
		})
	}
}
