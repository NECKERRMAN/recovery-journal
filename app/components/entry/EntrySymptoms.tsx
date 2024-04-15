'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'

export default function EntrySymptoms(data: any) {
    const [symptoms, setSymptoms] = useState<string[]>([])

    useEffect(() => {
        setSymptoms(data.data)
    }, [])

    return (
        <>
            <Label>
                Symptoms{' '}
                <span className="text-sm text-muted-foreground">
                    separate symptoms with commas
                </span>
            </Label>
            <Input
                type="text"
                name="symptoms"
                defaultValue={symptoms.join(',')}
                placeholder="Enter symptoms separated by commas"
                onKeyUp={(e) => {
                    if (
                        e.key === ',' &&
                        e.currentTarget.value.trim().replace(',', '') !== ''
                    ) {
                        setSymptoms([
                            ...symptoms,
                            e.currentTarget.value.trim().replace(',', ''),
                        ])
                    }
                }}
            />
            {/* <ul className="flex items-center space-x-2">
                {symptoms.map((symptom: string, index: number) => (
                    <li
                        key={index}
                        data-symptom={symptom}
                        className="text-sm text-slate-600 p-2 rounded-lg bg-slate-200 flex items-center"
                        onClick={(e) => {
                            setSymptoms(
                                symptoms.filter(
                                    (s: string) =>
                                        s !== e.currentTarget.dataset.symptom
                                )
                            )
                        }}
                    >
                        {symptom}
                        <span className="hover:cursor-pointer">
                            <X className="w-4 h-4 ml-2" />
                        </span>
                    </li>
                ))}
            </ul> */}
        </>
    )
}
