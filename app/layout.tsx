import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from './components/theme-provider'
import NavBar from './components/NavBar'
import { Toaster } from '@/components/ui/toaster'
import prisma from './lib/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Recovery Journal',
    description: 'Keep track of your recovery with Recovery Journal',
}

async function getData(userId: string) {
    if (userId) {
        const data = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                colorScheme: true,
            },
        })

        return data
    }
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const { getUser } = getKindeServerSession()
    const user = await getUser()
    const data = await getData(user?.id as string)

    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${inter.className} ${
                    data?.colorScheme ?? 'theme-red'
                }`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <NavBar />
                    {children}
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    )
}
