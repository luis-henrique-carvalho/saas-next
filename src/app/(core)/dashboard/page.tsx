import { headers } from 'next/headers'
import React from 'react'

import LogoutButton from '@/app/(auth)/components/logout-button'
import { auth } from '@/lib/auth'

const Dashboard = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    return (
        <div>
            Dashboard
            <h2>{session?.user.name}</h2>
            <h2>{session?.user.email}</h2>
            {
                session && <LogoutButton />
            }
        </div>
    )
}

export default Dashboard
