import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'
import { Button } from '@/components/ui/button'
import {
    RegisterLink,
    LoginLink,
    LogoutLink,
} from '@kinde-oss/kinde-auth-nextjs/components'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'

export default async function NavBar({ t, lang }: any) {
    const { isAuthenticated } = getKindeServerSession()

    return (
        <nav className="border-b bg-background h-[10vh] flex items-center">
            <div className="container flex items-center justify-between">
                <Link href="/">
                    <h1 className="font-bold text-3xl">Lorem Ipsum</h1>
                </Link>
                <div className="flex items-center gap-x-5">
                    <ThemeToggle />

                    {(await isAuthenticated()) ? (
                        <LogoutLink>
                            <Button>Sign Out</Button>
                        </LogoutLink>
                    ) : (
                        <div className="flex items-center gap-x-5">
                            <LoginLink>
                                <Button>{t.buttons.signIn}</Button>
                            </LoginLink>

                            <RegisterLink>
                                <Button variant={'secondary'}>
                                    {t.buttons.signUp}
                                </Button>
                            </RegisterLink>
                        </div>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Globe className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Link href="/en">
                                    <Button
                                        variant={
                                            lang === 'en' ? 'default' : 'ghost'
                                        }
                                    >
                                        English
                                    </Button>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href="/nl">
                                    <Button variant={
                                        lang === 'nl' ? 'default' : 'ghost'
                                    }>Nederlands</Button>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    )
}
