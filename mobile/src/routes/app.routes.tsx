import { createNativeStackNavigator } from '@react-navigation/native-stack'

const { Navigator, Screen } = createNativeStackNavigator()

import { Habit } from "../screens/Habit"
import { Home } from "../screens/Home"
import { New } from "../screens/New"

export const AppRoutes = () => {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name='home'component={Home} />
            <Screen name='habit'component={Habit} />
            <Screen name='new'component={New} />
        </Navigator>
    )
}