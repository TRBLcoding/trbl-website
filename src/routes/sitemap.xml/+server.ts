import { env } from "$env/dynamic/public"
import { productStore } from "$lib/stores/ProductStore"
import { error, type RequestHandler } from '@sveltejs/kit'
import * as sitemap from 'super-sitemap'

export const prerender = false

export const GET: RequestHandler = async () => {
	if (!env.PUBLIC_SITE_ORIGIN) {
		throw error(500, 'PUBLIC_SITE_ORIGIN environment variable is not defined')
	}

	const productSlugs = (await productStore.getAllProductSlugs()).map(e => e.toString())

	return await sitemap.response({
		excludeRoutePatterns: [
			// -- Routes that dont make sense in a sitemap --
			"^/api",
			"^/cart",
			"^/checkout",
			"^/todo",
			// -- Routes that are protected  --
			"^/profile",
			"^/dashboard",
			"^/products/edit",
			"^/products/new",
			"^/product-groups/edit",
			"^/product-groups/new",
			"^/privacy-policy/send-update",
		],
		paramValues: {
			'/products/[slug]': productSlugs,
		},
		origin: env.PUBLIC_SITE_ORIGIN,
	})
}