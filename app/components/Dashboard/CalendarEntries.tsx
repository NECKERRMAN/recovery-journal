'use client'
import { Calendar } from '@/components/ui/calendar'
import { useEffect, useState } from 'react'

const CalendarEntries = ({ onNewDate }: { onNewDate: Function }) => {
    const [date, setDate] = useState<Date | undefined>(new Date())
    useEffect(() => {
        onNewDate(date)
    }, [date, onNewDate])

    return (
        <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border w-fit"
        />
    )
}

export default CalendarEntries
