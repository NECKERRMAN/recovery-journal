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
            name: true,
            email: true,
            colorScheme: true,
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
                name: (formData.get('name') as string) ?? '',
                colorScheme: (formData.get('color') as string) ?? 'theme-slate',
            },
        })

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
                        <CardTitle>Personal Data</CardTitle>
                        <CardDescription>
                            Keep your personal information up to date. Don&#39;t
                            forget to save!
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input
                                    name="name"
                                    id="name"
                                    type="text"
                                    placeholder="Tyler Durden"
                                    defaultValue={data?.name ?? undefined}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>E-mail</Label>
                                <Input
                                    name="email"
                                    id="email"
                                    type="email"
                                    placeholder="tyler@mp.xyz"
                                    defaultValue={data?.email as string}
                                    disabled
                                />
                            </div>

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
