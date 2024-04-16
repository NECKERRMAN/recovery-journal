import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import prisma from '@/app/lib/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { SubmitButton } from '../../components/buttons/SubmitButtons'
import { revalidatePath, unstable_noStore as noStore } from 'next/cache'

async function getData(userId: string) {
    noStore()
    // Fetch data from Prisma - Supabase
    const data = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            colorScheme: true,
            locale: true,
        },
    })

    return data
}

export default async function SettingsPage() {
    const { getUser } = getKindeServerSession()
    const user = await getUser()
    const data = await getData(user?.id as string)

    async function handleData(formData: FormData) {
        'use server'
        // Update the user data
        await prisma.user.update({
            where: {
                id: user?.id,
            },
            data: {
                colorScheme: (formData.get('color') as string) ?? 'theme-slate',
                locale: (formData.get('locale') as string) ?? 'en-US',
            },
        })
        // Revalidate the cache
        revalidatePath('/', 'layout')
    }

    return (
        <div className="grid items-start gap-8">
            <div className="flex items-center justify-between px-2">
                <div className="grid gap-1">
                    <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your settings
                    </p>
                </div>
            </div>
            <Card>
                <form action={handleData}>
                    <CardHeader>
                        <CardTitle>Your preferences</CardTitle>
                        <CardDescription>
                            Set your preferences here. Don&#39;t forget to save!
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Color Scheme</Label>
                                <Select
                                    name="color"
                                    defaultValue={data?.colorScheme}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a color" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Color</SelectLabel>
                                            <SelectItem value="theme-green">
                                                Green
                                            </SelectItem>
                                            <SelectItem value="theme-red">
                                                Red
                                            </SelectItem>
                                            <SelectItem value="theme-rose">
                                                Rose
                                            </SelectItem>
                                            <SelectItem value="theme-slate">
                                                Slate
                                            </SelectItem>
                                            <SelectItem value="theme-stone">
                                                Stone
                                            </SelectItem>
                                            <SelectItem value="theme-zinc">
                                                Zinc
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Language selector doesn't work yet */}
                            <div className="space-y-2">
                                <Label>Language</Label>
                                <Select
                                    name="locale"
                                    defaultValue={data?.locale}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Language</SelectLabel>
                                            <SelectItem value="fr-FR">
                                                Français
                                            </SelectItem>
                                            <SelectItem value="en-US">
                                                English
                                            </SelectItem>
                                            <SelectItem value="nl-NL">
                                                Nederlands
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <SubmitButton />
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
