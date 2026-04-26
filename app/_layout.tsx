import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '../src/store/useAuthStore';

export default function RootLayout() {
  const { isAuthenticated, isLoading, initialize } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated and not in auth group
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to home if authenticated and in auth group
      router.replace('/');
    }
  }, [isAuthenticated, segments, isLoading]);

  if (isLoading) {
    return null; // Or a splash screen
  }

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Car Inspection' }} />
        <Stack.Screen name="(auth)/login" options={{ title: 'Login', headerShown: false }} />
        <Stack.Screen name="(auth)/signup" options={{ title: 'Sign Up', headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
