import { writable } from 'svelte/store';

export type ModalState = "Login" | "Register" | "RequestReset" | "Reset" | "Confirm"

export const loginModalOpenStore = writable<boolean>(false)
export const loginModalStateStore = writable<ModalState>('Login')
