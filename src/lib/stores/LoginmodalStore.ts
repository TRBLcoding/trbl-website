import { writable } from 'svelte/store'

export type ModalState = "Login" | "Register" | "RequestReset" | "Reset" | "Confirm" | "Email1" | "Email2"

export const loginModalOpenStore = writable<boolean>(false)
export const loginModalStateStore = writable<ModalState>('Login')
