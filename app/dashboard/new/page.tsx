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
import Link from 'next/link'
import React from 'react'
import { SubmitButton } from '../../components/buttons/SubmitButtons'
import prisma from '@/app/lib/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'

async function NewEntry() {
    noStore()
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    async function postData(formData: FormData) {
        'use server'

        if (!user) throw new Error('Not authorized to create an entry')

        await prisma.entry.create({
            data: {
                userId: user?.id,
                title: (formData.get('title') as string) ?? 'Titleless entry',
                content:
                    (formData.get('content') as string) ??
                    'Nothing to see here...',
                symptoms: {
                    set:
                        (formData.get('symptoms') as string)
                            .split(',')
                            .filter((s) => s.trim() !== '') ?? [],
                },
            },
        })

        return redirect('/dashboard')
    }
    return (
        <Card>
            <form action={postData}>
                <CardHeader>
                    <CardTitle>New entry</CardTitle>
                    <CardDescription>Write a new entry</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-y-5">
                    <div className="gap-y-2 flex flex-col">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="The first rule of..."
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-y-2">
                        <Label>Content</Label>
                        <Textarea
                            name="content"
                            placeholder="Describe your day"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-y-2">
                        <Label>
                            Symptoms{' '}
                            <span className="text-sm text-muted-foreground">
                                separate symptoms with commas
                            </span>
                        </Label>
                        <Input
                            type="text"
                            name="symptoms"
                            placeholder="Enter symptoms separated by commas"
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

export default NewEntry
