import { Button } from '@/components/ui/button'
import { Edit, File, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import prisma from '@/app/lib/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { Card } from '@/components/ui/card'
import { TrashEntry } from '../components/buttons/SubmitButtons'
import { revalidatePath, unstable_noStore as noStore } from 'next/cache'
import EntryCard from '../components/cards/EntryCard'

async function getData(userId: string) {
    // Keep data dynamic
    noStore()
    const data = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            Entries: true,
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
    const data = await getData(user?.id as string)

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
        <div className="grid items-start gap-y-8">
            <div className="flex items-center justify-between px-2">
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

            {data?.Entries.length == 0 ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <File className="w-10 h-10 text-primary" />
                    </div>

                    <h2 className="mt-6 text-xl font-semibold">
                        You don&#39;t have any journal entries
                    </h2>
                    <p className="mb-8 mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm mx-auto">
                        You currently don&#39;t have any journal entries. Go
                        ahead and write your first one!
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-y-4">
                    {data?.Entries.map((entry) => (
                        <EntryCard key={entry.id} entry={entry} deleteEntry={deleteEntry} />
                    ))}
                </div>
            )}
        </div>
    )
}
