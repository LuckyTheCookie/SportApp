import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TimerScreen from '../screens/TimerScreen';
import ChronometreScreen from '../screens/ChronometreScreen';
import StatistiquesScreen from '../screens/StatistiquesScreen';
import ReglagesScreen from '../screens/ReglagesScreen';
import OnboardingScreen from '../screens/OnboardingScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Timer" component={TimerScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Chronometre" component={ChronometreScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Statistiques" component={StatistiquesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Reglages" component={ReglagesScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
