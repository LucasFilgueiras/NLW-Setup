import { useState } from "react"
import { View, ScrollView, Text, TextInput, TouchableOpacity, Alert } from "react-native"
import { BackButton } from "../components/BackButton"
import { CheckBox } from "../components/CheckBox"
import { Feather } from '@expo/vector-icons'
import colors from "tailwindcss/colors"
import { api } from "../lib/axios"

const availableWeekDays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]

export const New = () => {
    const [weekDays, setWeekDays] = useState<number[]>([])
    const [title, setTitle] = useState("")

    const handleToggleWeekDay = (weekDaysIndex: number) => {
        if (weekDays.includes(weekDaysIndex)) {
            setWeekDays(prevValue => prevValue.filter(weekDay => weekDay !== weekDaysIndex))
        } else {
            setWeekDays(prevValue => [...prevValue, weekDaysIndex])
        }
    }

    async function handleCreateNewHabit() {
        try {
            if (!title.trim() || weekDays.length === 0) {
                Alert.alert("Ops...", "Digite um título para o hábito e escolha pelo menos um dia da semana.")
            } else {
                await api.post("/habits", {
                    title,
                    weekDays
                })
                Alert.alert("Hábito criado com sucesso", "")
                setTitle('')
                setWeekDays([])
            }
        } catch (error) {
            console.log(error)
            Alert.alert("Ops...", "Não foi possível criar o hábito.")
        }
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                <BackButton />

                <Text className="mt-6 text-white font-extrabold text-3xl"> 
                    Criar hábito
                </Text>

                <Text className="mt-6 text-white font-semibold text-base"> 
                    Qual o seu comprometimento?
                </Text>

                <TextInput 
                    className="h-12 pl-4 rounded-lg mt-3 bg-zinc-800 text-white focus:border-2 focus:border-green-600"
                    placeholder="Exercicíos, dormir bem, etc..."
                    placeholderTextColor={colors.zinc[400]}
                    onChangeText={setTitle}
                    value={title}
                />

                <Text className="font-semibold mt-4 mb-3 text-white text-base">
                    Qual a recorrência?
                </Text>

                {
                    availableWeekDays.map((day, i) => {
                        return (
                            <CheckBox 
                                key={day} 
                                title={day}
                                checked={weekDays.includes(i)}
                                onPress={() => handleToggleWeekDay(i)}
                            />
                        )
                    })
                }

                <TouchableOpacity 
                    className="flex-row w-full h-14 items-center justify-center bg-green-600 rounded-md mt-6" 
                    activeOpacity={.7}
                    onPress={handleCreateNewHabit}
                >
                    <Feather
                        name="check"
                        size={20}
                        color={colors.white}
                    />

                    <Text className="text-white font-semibold text-base ml-2">Confirmar</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}