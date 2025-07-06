/**
 * Source: https://stackoverflow.com/a/11409944/8807613
 * 
 * Returns a number whose value is limited to the given range.
 */
export function clamp(number: number, min: number, max: number) {
	return Math.min(Math.max(number, min), max)
}