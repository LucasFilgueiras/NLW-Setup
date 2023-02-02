import * as Checkbox from '@radix-ui/react-checkbox';
import dayjs from 'dayjs';
import { Check } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';

interface HabitsListProps {
    date: Date
    onCompletedChanged: (completed: number) => void
}

interface HabitsInfo {
    possibleHabits: {
        id: string
        title: string
        created_at: string
    }[],
    completedHabits: string[]
}

export const HabitsList = ({date, onCompletedChanged}: HabitsListProps) => {
    const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>()

    const isDateInPast = dayjs(date).endOf('day').isBefore(new Date)

    const handleToggleHabit = async (habitId: string) => {
        const isHabitAlreadyCompleted = habitsInfo!.completedHabits.includes(habitId)
        let completedHabits: string[] = []

        await api.patch(`/habits/${habitId}/toggle`)

        if (isHabitAlreadyCompleted) {
            completedHabits = habitsInfo!.completedHabits.filter(id => id !== habitId)
        } else {
            completedHabits = [...habitsInfo!.completedHabits, habitId]
        }

        setHabitsInfo({
            possibleHabits: habitsInfo!.possibleHabits,
            completedHabits,
        })

        onCompletedChanged(completedHabits.length)
    }

    useEffect(() => {
        api.get("/day", {
            params: {
                date: date.toISOString()
            }
        }).then(res => setHabitsInfo(res.data))
    }, [])

    return (
        <div>
            {habitsInfo?.possibleHabits.map(habit => {
                return (
                    <div key={habit.id} className='mt-2 flex flex-col gap-2'>
                        <Checkbox.Root
                            className='flex items-center gap-3 group'
                            checked={habitsInfo.completedHabits.includes(habit.id)}
                            disabled={isDateInPast}
                            onCheckedChange={() => handleToggleHabit(habit.id)}
                        >
                            <div 
                                className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors'
                            >
                                <Checkbox.Indicator>
                                    <Check size={20} className="text-white"/>
                                </Checkbox.Indicator>
                            </div>

                            <span className='font-semibold text-lg text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400'>
                                {habit.title}
                            </span>
                        </Checkbox.Root>
                    </div>
                )
            })}
        </div>
    )
}