"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

const LogoutButton = () => {
    const router = useRouter()

    return (
        <Button onClick={() => authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    toast.success("You have been signed out successfully!")
                    router.push("/login")
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message || "Sign out failed!")
                }
            },
        })}>
            Sign Out
        </Button >
    )
}

export default LogoutButton
