export const TAB_TYPES = ["personal", "security", "invoice", "delete"] as const
export type TabType = typeof TAB_TYPES[number];