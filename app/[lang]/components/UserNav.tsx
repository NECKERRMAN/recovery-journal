import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { CreditCard, DoorClosed, Home, Settings, User } from 'lucide-react';
import Link from 'next/link';

export const navItems = [
    {
        name: 'Home',
        href: '/dashboard',
        icon: Home,
    },
    {
        name: 'Profile',
        href: '/dashboard/profile',
        icon: User,
    },
    {
        name: 'Billing',
        href: '/dashboard/billing',
        icon: CreditCard,
    },
    {
        name: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
    },
]

export default function UserNav({ name, email, image}: { name: string, email: string, image: string}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className='relative h-10 w-10 rounded-full'>
                    <Avatar className='h-10 w-10 rounded-full'>
                        <AvatarImage src={ image } alt='User Avatar' />
                        <AvatarFallback>?</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent  className='min-w-56' align='end' forceMount>
                <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{ name }</p>
                    <p className='text-xs leading-none text-muted-foreground'>{ email }</p>
                </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {
                        navItems.map((item, index) => (
                            <DropdownMenuItem asChild key={index}>
                                <Link href={item.href} className="w-full flex justify-between items-center">
                                    { item.name }
                                    <span><item.icon className="h-4 w-4" /></span>
                                </Link>
                            </DropdownMenuItem>
                        ))
                    }
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='w-full flex justify-between items-center' asChild>
                    <LogoutLink>
                        Logout <span><DoorClosed className="h-4 w-4" /></span>
                    </LogoutLink>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}