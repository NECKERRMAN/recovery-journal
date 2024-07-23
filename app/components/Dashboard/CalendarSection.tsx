'use client'
import React, { useEffect, useState } from 'react'
import CalendarEntries from './CalendarEntries'
import { File } from 'lucide-react'
import { Entry, User } from '@prisma/client'
import { Card } from '@/components/ui/card'
import { unstable_noStore as noStore } from 'next/cache'
import prisma from '@/app/lib/db'
import SelectedEntries from './SelectedEntries'

const CalendarSection = ({ data, userId }: { data: any; userId: string }) => {
    const [date, setDate] = useState<Date>(new Date())

    return (
        <div className="mb-4 ">
            <div className="flex gap-4 mb-4 border-primary border-b-2 pb-4 ">
                <CalendarEntries onNewDate={setDate} />
                {data?.Entries.length < 1 ? (
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
                    <div className="w-full flex-1">
                        <h3 className="text-lg font-semibold mb-2">
                            Last 3 entries
                        </h3>
                        <div className="flex flex-col gap-y-2">
                            {data?.Entries.map((entry: Entry) => (
                                //{/* <EntryCard key={entry.id} entry={entry} deleteEntry={deleteEntry} /> */}
                                <Card key={entry.id} className="p-4">
                                    <h3 className="text-2xl font-semibold text-primary">
                                        {entry.title}
                                    </h3>
                                    <p className="capitalize text-sm">
                                        {new Intl.DateTimeFormat('nl-NL', {
                                            dateStyle: 'full',
                                        }).format(new Date(entry.createdAt))}
                                    </p>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div>
                <h2 className="text-2xl font-bold">
                    {new Intl.DateTimeFormat('nl-NL', {}).format(date)}
                </h2>
                <SelectedEntries selectedDate={date} />
            </div>
        </div>
    )
}

export default CalendarSection
