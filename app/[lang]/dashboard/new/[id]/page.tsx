import { SubmitButton } from '@/app/[lang]/components/buttons/SubmitButtons'
import prisma from '@/app/[lang]/lib/db'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { revalidatePath, unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'
import { redirect } from 'next/navigation'

async function getData({
    entryId,
    userId,
}: {
    entryId: string
    userId: string
}) {
    noStore()
    const data = await prisma.entry.findUnique({
        where: {
            id: entryId,
            userId: userId,
        },
        select: {
            id: true,
            title: true,
            content: true,
        },
    })

    return data
}

export default async function DynamicRoute({
    params,
}: {
    params: { id: string }
}) {
    const { getUser } = getKindeServerSession()
    const user = await getUser()
    const data = await getData({
        entryId: params.id,
        userId: user?.id as string,
    })

    if (!data) {
        throw new Error('Entry not found')
    }

    async function postData(formData: FormData) {
        'use server'

        if (!user) throw new Error('Not authorized to edit this entry')

        await prisma.entry.update({
            where: {
                id: data?.id,
                userId: user.id,
            },
            data: {
                title: (formData.get('title') as string) ?? 'Titleless entry',
                content:
                    (formData.get('content') as string) ??
                    'Nothing to see here...',
            },
        })

        revalidatePath('/dashboard')
        return redirect('/dashboard')
    }
    return (
        <Card>
            <form action={postData}>
                <CardHeader>
                    <CardTitle>Edit journal entry</CardTitle>
                    <CardDescription>
                        Here you can edit your entry
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-y-5">
                    <div className="gap-y-2 flex flex-col">
                        <Label>Title</Label>
                        <Input
                            required
                            type="text"
                            name="title"
                            placeholder="Title for your note"
                            defaultValue={data?.title}
                        />
                    </div>

                    <div className="flex flex-col gap-y-2">
                        <Label>Content</Label>
                        <Textarea
                            name="content"
                            placeholder="Describe your day"
                            required
                            defaultValue={data?.content}
                        />
                    </div>
                </CardContent>

                <CardFooter className="flex justify-start gap-2">
                    <Button asChild variant="secondary">
                        <Link href="/dashboard">Cancel</Link>
                    </Button>
                    <SubmitButton />
                </CardFooter>
            </form>
        </Card>
    )
}
