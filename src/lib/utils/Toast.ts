import type { ResolvedPathname } from "$app/types"
import CreatedToast from "$components/CreatedToast.svelte"
import { toast } from "@zerodevx/svelte-toast"

export function pushCreatedToast(createdText: string, config?: { gotoPathname?: ResolvedPathname, removeLast?: boolean }) {
    if (config?.removeLast) {
        toast.pop()
    }
    toast.push({
        component: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            src: CreatedToast as any,
            props: {
                createdText: createdText,
                gotoPathname: config?.gotoPathname
            },
            sendIdTo: "toastId",
        },
        dismissable: false,
        initial: 0,
    })
}