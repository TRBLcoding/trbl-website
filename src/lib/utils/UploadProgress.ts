import { blobToWebP } from 'webp-converter-browser'
import { updateStoreAtIndex } from './Svelte'
import { MAX_CONCURRENT_UPLOADS, WEBP_IMAGE_QUALITY, WEBP_THUMBNAIL_QUALITY } from './Constants'
import { v4 as uuidv4 } from 'uuid'
import generateImageThumbnail from './ImageThumbnail'
import type { Writable } from 'svelte/store'
import pLimit from 'p-limit'
import { supabase } from '$lib/supabase/supabaseClient'
export enum UploadProgress {
	NOT_STARTED = 0,
	CONVERTING = 1,
	UPLOADING = 2,
	DONE = 3
}

export function toString(uploadProgress: UploadProgress) {
	switch (uploadProgress) {
		case UploadProgress.NOT_STARTED: return "Not started"
		case UploadProgress.CONVERTING: return "Converting"
		case UploadProgress.UPLOADING: return "Uploading"
		case UploadProgress.DONE: return "Done"
	}
}

/**
 * Already uploaded images are skipped
 */
export async function convertAndUploadImages(combinedImages: (string | File)[], bucket: string, folder: string, progressStore: Writable<UploadProgress[]>) {
	const limit = pLimit(MAX_CONCURRENT_UPLOADS)
	let size = 0

	const uploadedImageIds = await Promise.all(combinedImages.map(async (image, index) => {
		return limit(async () => {
			// -- Keep existing url --
			if (!(image instanceof File)) {
				updateStoreAtIndex(progressStore, index, UploadProgress.DONE)
				return image
			}

			// // -- Convert image to webp --
			updateStoreAtIndex(progressStore, index, UploadProgress.CONVERTING)
			const convertedImage = await blobToWebP(image, { quality: WEBP_IMAGE_QUALITY })
			size += convertedImage.size

			// // -- Create thumbnail --
			const thumbnail = await generateImageThumbnail(image, {
				width: 900,
				height: 900,
				maintainAspectRatio: true,
				type: 'image/webp',
				quality: WEBP_THUMBNAIL_QUALITY
			})
			size += thumbnail.size
			updateStoreAtIndex(progressStore, index, UploadProgress.UPLOADING)

			// -- Upload --
			const imageId = uuidv4()
			const responseImage = await supabase.storage
				.from(bucket)
				.upload(`${folder}${imageId}.webp`, convertedImage)
			if (responseImage.error)
				console.error("Error uploading image:", responseImage.error)
			const responseThumbnail = await supabase.storage
				.from(bucket)
				.upload(`${folder}/thumbnails/${imageId}.webp`, thumbnail)
			if (responseThumbnail.error)
				console.error("Error uploading thumbnail:", responseThumbnail.error)

			updateStoreAtIndex(progressStore, index, UploadProgress.DONE)
			return imageId
		})
	}))
	return { uploadedImageIds, size }
}

// export async function deleteImages(imageUrls: string[], progressStore?: Writable<number>) {
// 	const { getStorage, ref, deleteObject } = await import('firebase/storage')
// 	const storage = getStorage()

// 	await Promise.all(imageUrls.map(async (image) => {
// 		try {
// 			const storageRef = ref(storage, image)
// 			await deleteObject(storageRef)
// 			progressStore?.update((progress) => progress + 1)
// 		} catch (error: any) {
// 			// Not existing images can be safely ignored
// 			if (error.code !== 'storage/object-not-found')
// 				throw error
// 		}
// 	}))
// }