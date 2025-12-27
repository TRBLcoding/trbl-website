import CreatedToast from "$components/CreatedToast.svelte"
import { toast } from "@zerodevx/svelte-toast"

export function pushCreatedToast(createdText: string, config?: { gotoUrl?: string, removeLast?: boolean }) {
    if (config?.removeLast) {
        toast.pop()
    }
    toast.push({
        component: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            src: CreatedToast as any,
            props: {
                createdText: createdText,
                gotoUrl: config?.gotoUrl,
            },
            sendIdTo: "toastId",
        },
        dismissable: false,
        initial: 0,
    })
}