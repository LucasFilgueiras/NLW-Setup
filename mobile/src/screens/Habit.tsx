import { ScrollView, View, Text, Alert } from "react-native"
import { useRoute } from "@react-navigation/native"
import { BackButton } from "../components/BackButton"
import dayjs from "dayjs"
import { ProgressBar } from "../components/ProgressBar"
import { CheckBox } from "../components/CheckBox"
import { useEffect, useState } from "react"
import { Loading } from "../components/Loading"
import { api } from "../lib/axios"
import { generateProgressPercentage } from "../utils/generate-progress.percentage"
import { HabitsEmpty } from "../components/HabitsEmpty"
import clsx from "clsx"

interface Params {
    date: string
}

interface HabitInfo {
    completedHabits: string[]
    possibleHabits: {
        id: string
        title: string
    }[]
}

export const Habit = () => {
    const [loading, setLoading] = useState(true)
    const [dayInfo, setDayInfo] = useState<HabitInfo | null>(null)
    const [completedHabits, setCompletedHabits] = useState<string[]>([])
    
    const route = useRoute()
    const { date } = route.params as Params

    const parsedDate = dayjs(date)
    const isDateInPast = parsedDate.endOf('day').isBefore(new Date())
    const dayOfWeek = parsedDate.format('dddd')
    const dayAndMonth = parsedDate.format('DD/MM')

    const fetchHabits = async () => {
        try {
            setLoading(true)
            const response = await api.get("/day", {
                params: {
                    date
                }
            })
            setDayInfo(response.data)
            setCompletedHabits(response.data.completedHabits)
        } catch (error) {
            console.log(error)
            Alert.alert("Ops...", "Não foi possível buscar os hábitos deste dia.")
        } finally {
            setLoading(false)
        }
    }

    const habitsProgress = dayInfo?.possibleHabits.length ? generateProgressPercentage(dayInfo.possibleHabits.length, completedHabits.length) : 0

    const handleToggleHabit = async (habitId: string) => {
        try {
            await api.patch(`/habits/${habitId}/toggle`)

            if (completedHabits.includes(habitId)) {
                setCompletedHabits(prevValue => prevValue.filter(habit => habit !== habitId))
            } else {
                setCompletedHabits(prevValue => [...prevValue, habitId])
            }
        } catch (error) {
            console.log(error)
            Alert.alert("Ops...", "Não foi possível atualizar o hábito.")
        }
    }

    useEffect(() => {
        fetchHabits()
    }, [])

    if (loading) {
        return <Loading />
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 50}}
            >
                <BackButton />

                <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
                    {dayOfWeek}
                </Text>

                <Text className="text-white font-extrabold text-3xl">
                    {dayAndMonth}
                </Text>

                <ProgressBar progress={habitsProgress} />

                <View className={clsx("mt-6", {
                    ["opacity-50"]: isDateInPast
                })}>
                    {dayInfo?.possibleHabits ? dayInfo?.possibleHabits.map(habit => (
                        <CheckBox
                            key={habit.id}
                            title={habit.title}
                            checked={completedHabits.includes(habit.id)}
                            onPress={() => handleToggleHabit(habit.id)}
                            disabled={isDateInPast}
                        />
                    )): <HabitsEmpty />}
                </View>

                {
                    isDateInPast && (
                        <Text className="text-white mt-10 text-center">
                            Você não pode editar um hábito de uma data anterior a data atual.
                        </Text>
                    )
                }

            </ScrollView>
        </View>
    )
}