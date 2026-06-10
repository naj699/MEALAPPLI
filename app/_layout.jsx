import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#F4F1DE' },
          headerTintColor: '#3D405B',
          headerTitleStyle: { fontWeight: '700', fontSize: 18 },
          headerBackTitle: 'Retour',
        }}
      >
        <Stack.Screen name="index" options={{ title: '🍽️ Meal Categories' }} />
        <Stack.Screen name="meals/[category]" options={{ title: 'Recettes' }} />
        <Stack.Screen name="meals/detail/[id]" options={{ title: 'Détail' }} />
      </Stack>
    </>
  );
}