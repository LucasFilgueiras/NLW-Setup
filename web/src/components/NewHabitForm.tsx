import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from "phosphor-react"
import { FormEvent, useState } from 'react';
import { api } from '../lib/axios';

export const NewHabitForm = () => {
    const [title, setTitle] = useState('')
    const [weekDays, setWeekDays] = useState<number[]>([])

    const availableWeekDays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]

    const createNewHabit = async (e: FormEvent) => {
        e.preventDefault()

        if (!title || weekDays.length === 0) {
            return
        }

        await api.post("/habits", {
            title,
            weekDays
        })

        setTitle("")
        setWeekDays([])

        alert("Hábito criado com sucesso!")
    }

    const handleToggleWeekDay = (weekDay: number) => {
        if (weekDays.includes(weekDay)) {
            const weekDaysWithRemovedOne = weekDays.filter(day => day !== weekDay)
            setWeekDays(weekDaysWithRemovedOne)
        } else {
            const weekDaysWithAddedOne = [...weekDays, weekDay]
            setWeekDays(weekDaysWithAddedOne)
        }
    }
    
    return (
        <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
            <label htmlFor="title" className="font-semibold leading-tight">
                Qual o seu compromentimento?
            </label>

            <input 
                type="text"
                id="title"
                placeholder="Ex.: Exercícios, dormir bem, etc..."
                className="px-4 py-3 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400"
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <label htmlFor="" className="font-semibold leading-tight mt-4">
                Qual a recorrência?
            </label>


            {availableWeekDays.map((weekDay, i) => (
                <div key={i} className="flex flex-col gap-2 mt-3">
                    <Checkbox.Root
                        className='flex items-center gap-3 group'
                        checked={weekDays.includes(i)}
                        onCheckedChange={() => handleToggleWeekDay(i)}
                    >
                        <div 
                            className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors'
                        >
                            <Checkbox.Indicator>
                                <Check size={20} className="text-white"/>
                            </Checkbox.Indicator>
                        </div>

                        <span className='text-white leading-tight'>{weekDay}</span>
                    </Checkbox.Root>
                </div>
            ))}

            <button type="submit" className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-700 transition-colors">
                <Check size={20} weight="bold" />
                Confirmar
            </button>
        </form>
    )
}