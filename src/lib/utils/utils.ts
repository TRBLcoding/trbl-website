import type { Navigation } from "@sveltejs/kit"
import { WEBP_THUMBNAIL_QUALITY } from "./Constants"
import generateImageThumbnail from "./ImageThumbnail"

/**
 * Source: https://stackoverflow.com/a/11409944/8807613
 * 
 * Returns a number whose value is limited to the given range.
 */
export function clamp(number: number, min: number, max: number) {
	return Math.min(Math.max(number, min), max)
}

export function sleep(time: number | undefined = 1000) {
	return new Promise<void>(resolve => {
		setTimeout(() => {
			resolve()
		}, time)
	})
}

// checks if navigation is not triggered by form or page load
export function isPageNavigation(navigation: Navigation) {
	return navigation.type === "leave" ||
		navigation.type === "link" ||
		navigation.type === "goto" ||
		navigation.type === "popstate"
}

export function ignoreDragOver(event: DragEvent, disabled = false) {
	if (disabled) return
	event.preventDefault()
}

/**
 * Source: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
 */
export function getFilesFromDragEvent(event: DragEvent) {
	event.preventDefault()

	if (!event.dataTransfer)
		return undefined
	// Use DataTransferItemList interface to access the file(s)
	if (event.dataTransfer.items) {
		return Array.from(event.dataTransfer.items)
			.filter((e) => e.kind === "file")
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			.map((e) => e.getAsFile()!)
	}
	// Use DataTransfer interface to access the file(s)
	return Array.from(event.dataTransfer.files)
}

/**
 * Source: https://stackoverflow.com/a/66807992
 */
export function readFileAsDataURL(file: File) {
	return new Promise<string>((accept, reject) => {
		const reader = new FileReader()
		reader.onload = (event) => {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			accept(event.target!.result as string)
		}
		/// XXX: rejecting with an event is rather unorthodox
		reader.onabort = reader.onerror = (ev) => {
			reject(ev)
		}
		reader.readAsDataURL(file)
	})
}

export function readFileAsPreviewDataURL(file: File) {
	return new Promise<string>((accept, reject) => {
		generateImageThumbnail(file, {
			width: 100,
			height: 100,
			maintainAspectRatio: true,
			type: 'image/webp',
			quality: WEBP_THUMBNAIL_QUALITY
		}).then((thumbnail) => {
			const reader = new FileReader()
			reader.onload = (event) => {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				accept(event.target!.result as string)
			}
			/// XXX: rejecting with an event is rather unorthodox
			reader.onabort = reader.onerror = (ev) => {
				reject(ev)
			}
			reader.readAsDataURL(thumbnail)
		})

	})
}

export function isChild(obj: any, parentObj: any) {
	while (
		obj != undefined &&
		obj != null &&
		obj.tagName.toUpperCase() != "BODY"
	) {
		if (obj == parentObj) {
			return true
		}
		obj = obj.parentNode
	}
	return false
}

export function doNothing() { }