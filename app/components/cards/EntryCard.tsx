import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Edit } from 'lucide-react'
import Link from 'next/link'
import { TrashEntry } from '../buttons/SubmitButtons'

interface EntryCardProps {
    entry: {
        id: string
        title: string
        content: string
        symptoms: string[]
        createdAt: Date
    }
    deleteEntry: (formData: FormData) => void
}

export default function EntryCard({ entry, deleteEntry }: EntryCardProps) {
    return (
        <Card
            key={entry.id}
            className="flex flex-col sm:flex-row items-center justify-between p-6 gap-8"
        >
            <div>
                <h3 className="text-2xl font-semibold text-primary">
                    {entry.title}
                </h3>
                <p className="capitalize text-sm mb-4">
                    {new Intl.DateTimeFormat('nl-NL', {
                        dateStyle: 'full',
                    }).format(new Date(entry.createdAt))}
                </p>
                <div className="space-y-2 mb-4">
                    <p className="font-semibold">Symptoms</p>
                    <ul className="flex gap-x-2">
                        {entry.symptoms.length === 0 && (
                            <li className="text-muted-foreground">
                                No symptoms
                            </li>
                        )}
                        {entry.symptoms.length > 0 &&
                            entry.symptoms.map((symptom, index) => (
                                <li
                                    key={index}
                                    className="text-sm text-slate-600 p-2 rounded-lg bg-slate-200"
                                >
                                    {symptom}
                                </li>
                            ))}
                    </ul>
                </div>
                <div className="flex flex-col gap-y-2">
                    <p className="font-semibold">Notes</p>
                    <p className="text-muted-foreground">{entry.content}</p>
                </div>
            </div>
            <div className="flex gap-x-4">
                <Link href={`/dashboard/new/${entry.id}`}>
                    <Button variant="outline" size="icon">
                        <Edit className="w-4 h-4" />
                    </Button>
                </Link>
                <form action={deleteEntry}>
                    <input type="hidden" name="entryId" value={entry.id} />
                    <TrashEntry />
                </form>
            </div>
        </Card>
    )
}
