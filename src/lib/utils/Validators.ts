export function validateEmail(value: string | undefined) {
	const pattern = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/g
	if (value && !value.match(pattern)) return "Email moet geldig zijn"
	return undefined
}