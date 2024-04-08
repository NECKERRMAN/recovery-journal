"use client"

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom'

export function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <>
        {
            pending ? (
                <Button disabled className='w-fit'>
                    <Loader2 className='h-4 w-4 mr-2' />
                    Pending...
                </Button>
            ) : (
                <Button type='submit'>Submit</Button>
            )
        }
        </>
    )
}