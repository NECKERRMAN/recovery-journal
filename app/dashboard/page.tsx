import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import prisma from '@/app/lib/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { revalidatePath, unstable_noStore as noStore } from 'next/cache'
import CalendarSection from '../components/Dashboard/CalendarSection'

async function getDataLastThree(userId: string) {
    // Keep data dynamic
    noStore()
    const data = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            Entries: {
                select: {
                    id: true,
                    title: true,
                    content: true,
                    symptoms: true,
                    createdAt: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: 3,
            },
            Subscription: {
                select: {
                    status: true,
                },
            },
        },
    })

    return data
}

export default async function DashboardPage() {
    const { getUser } = getKindeServerSession()

    const user = await getUser()
    const data = await getDataLastThree(user?.id as string)

    async function deleteEntry(formData: FormData) {
        'use server'

        await prisma.entry.delete({
            where: {
                id: formData.get('entryId') as string,
            },
        })

        revalidatePath('/dashboard')
    }

    return (
        <div className="grid items-start">
            <div className="flex items-center justify-between px-2 mb-8">
                <div className="grid gap-1">
                    <h1 className="text-2xl md:text-3xl font-bold">
                        Your journal entries
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Create, read and edit your journal entries
                    </p>
                </div>

                {data?.Subscription?.status === 'active' ? (
                    <Link href="/dashboard/new">
                        <Button>
                            <PlusCircle size={16} className="mr-2" />
                            New entry
                        </Button>
                    </Link>
                ) : (
                    <Link href="/dashboard/billing">
                        <Button>
                            <PlusCircle size={16} className="mr-2" />
                            Buy access
                        </Button>
                    </Link>
                )}
            </div>
            <CalendarSection data={data} userId={user?.id as string} />
        </div>
    )
}
